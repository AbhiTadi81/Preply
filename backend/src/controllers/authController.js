/**
 * Authentication Controller
 * 
 * Responsibilities:
 * - register: Creates new user accounts, hashes passwords securely with bcrypt, and issues JWT tokens.
 * - login: Validates email and password, returning user data and JWT token on success.
 * - getCurrentUser: Returns profile information for the currently authenticated user (via req.user).
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { User } from "../models/User.js";
import { PendingRegistration } from "../models/PendingRegistration.js";
import { PasswordReset } from "../models/PasswordReset.js";
import { ENV } from "../config/env.js";
import { sendPasswordResetOtp, sendSignupOtp } from "../services/emailService.js";

function createToken(user) {
  return jwt.sign({
    id: user._id.toString(),
    email: user.email,
    sessionVersion: user.sessionVersion || 0
  }, ENV.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    createdAt: user.createdAt
  };
}

function normalizeRegistration(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const targetRole = typeof body.targetRole === "string" && body.targetRole.trim()
    ? body.targetRole.trim()
    : "Frontend Developer";
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || password.length < 8 || password.length > 128) {
    return null;
  }
  return { name, email, password, targetRole };
}

function hashOtp(challengeId, otp) {
  return crypto.createHmac("sha256", ENV.JWT_SECRET).update(`${challengeId}:${otp}`).digest("hex");
}

function createOtp() {
  return String(crypto.randomInt(0, 10000)).padStart(4, "0");
}

function resendTime(date) {
  return date.toISOString();
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const authController = {
  async register(req, res, next) {
    const registration = normalizeRegistration(req.body);
    if (!registration) return res.status(400).json({ message: "Enter a valid name, email, and password of at least 8 characters." });
    try {
      if (await User.exists({ email: registration.email })) {
        return res.status(409).json({ message: "A user with this email already exists" });
      }
      if (await PendingRegistration.exists({ email: registration.email })) {
        return res.status(409).json({ message: "A verification is already pending for this email. Check your inbox or wait before resending." });
      }
      const challengeId = crypto.randomUUID();
      const otp = createOtp();
      const resendAvailableAt = new Date(Date.now() + ENV.OTP_RESEND_COOLDOWN_SECONDS * 1000);
      const pending = await PendingRegistration.create({
        ...registration,
        challengeId,
        passwordHash: await bcrypt.hash(registration.password, 12),
        otpHash: hashOtp(challengeId, otp),
        otpExpiresAt: new Date(Date.now() + ENV.OTP_EXPIRES_MINUTES * 60 * 1000),
        resendAvailableAt
      });
      try {
        await sendSignupOtp(registration.email, otp);
      } catch (error) {
        await PendingRegistration.deleteOne({ _id: pending._id });
        throw error;
      }
      return res.status(202).json({ challengeId, email: registration.email, resendAvailableAt: resendTime(resendAvailableAt) });
    } catch (error) {
      return next(error);
    }
  },
  async resendOtp(req, res, next) {
    const challengeId = typeof req.body.challengeId === "string" ? req.body.challengeId : "";
    if (!challengeId) return res.status(400).json({ message: "A verification session is required." });
    try {
      const now = new Date();
      const otp = createOtp();
      const pending = await PendingRegistration.findOneAndUpdate(
        { challengeId, resendAvailableAt: { $lte: now } },
        {
          $set: {
            otpHash: hashOtp(challengeId, otp),
            otpExpiresAt: new Date(Date.now() + ENV.OTP_EXPIRES_MINUTES * 60 * 1000),
            resendAvailableAt: new Date(Date.now() + ENV.OTP_RESEND_COOLDOWN_SECONDS * 1000),
            attempts: 0
          }
        },
        { new: true }
      );
      if (!pending) {
        const current = await PendingRegistration.findOne({ challengeId });
        if (!current) return res.status(404).json({ message: "Verification session expired. Please register again." });
        return res.status(429).json({ message: "Please wait before requesting another code.", resendAvailableAt: resendTime(current.resendAvailableAt) });
      }
      try {
        await sendSignupOtp(pending.email, otp);
      } catch (error) {
        await PendingRegistration.deleteOne({ _id: pending._id });
        throw error;
      }
      return res.json({ email: pending.email, resendAvailableAt: resendTime(pending.resendAvailableAt) });
    } catch (error) {
      return next(error);
    }
  },
  async verifyOtp(req, res, next) {
    const challengeId = typeof req.body.challengeId === "string" ? req.body.challengeId : "";
    const otp = typeof req.body.otp === "string" ? req.body.otp : "";
    if (!challengeId || !/^\d{4}$/.test(otp)) return res.status(400).json({ message: "Enter the four-digit verification code." });
    try {
      const pending = await PendingRegistration.findOne({ challengeId });
      if (!pending) return res.status(400).json({ message: "This verification session has expired. Please register again." });
      if (pending.otpExpiresAt <= new Date()) return res.status(400).json({ message: "This code has expired. Please request a new one." });
      if (pending.attempts >= ENV.OTP_MAX_ATTEMPTS) return res.status(429).json({ message: "Too many incorrect attempts. Please request a new code." });
      const matches = crypto.timingSafeEqual(
        Buffer.from(pending.otpHash),
        Buffer.from(hashOtp(challengeId, otp))
      );
      if (!matches) {
        await PendingRegistration.updateOne({ _id: pending._id }, { $inc: { attempts: 1 } });
        return res.status(400).json({ message: "Incorrect verification code." });
      }
      const consumed = await PendingRegistration.findOneAndDelete({
        _id: pending._id,
        otpHash: pending.otpHash,
        attempts: { $lt: ENV.OTP_MAX_ATTEMPTS }
      });
      if (!consumed) return res.status(400).json({ message: "This code has already been used." });
      let user;
      try {
        user = await User.create({
          name: consumed.name,
          email: consumed.email,
          passwordHash: consumed.passwordHash,
          targetRole: consumed.targetRole
        });
      } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ message: "A user with this email already exists" });
        throw error;
      }
      return res.status(201).json({ user: publicUser(user), token: createToken(user) });
    } catch (error) {
      return next(error);
    }
  },
  async requestPasswordReset(req, res, next) {
    const email = normalizeEmail(req.body.email);
    if (!validEmail(email)) return res.status(400).json({ message: "Enter a valid email address." });
    try {
      const now = new Date();
      const userExists = await User.exists({ email });
      const existing = await PasswordReset.findOne({ email });
      if (existing && existing.resendAvailableAt > now) {
        return res.status(202).json({
          message: "If an account exists for this email, a verification code has been sent.",
          challengeId: existing.challengeId,
          email,
          resendAvailableAt: resendTime(existing.resendAvailableAt)
        });
      }

      const challengeId = crypto.randomUUID();
      const otp = createOtp();
      const resendAvailableAt = new Date(Date.now() + ENV.OTP_RESEND_COOLDOWN_SECONDS * 1000);
      const reset = await PasswordReset.findOneAndUpdate(
        { email },
        {
          $set: {
            challengeId,
            otpHash: hashOtp(challengeId, otp),
            otpExpiresAt: new Date(Date.now() + ENV.PASSWORD_RESET_OTP_EXPIRES_MINUTES * 60 * 1000),
            attempts: 0,
            resendAvailableAt,
            verifiedAt: null
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (userExists) {
        try {
          await sendPasswordResetOtp(email, otp);
        } catch (error) {
          await PasswordReset.deleteOne({ _id: reset._id });
          console.warn("[Auth] Password reset email was not delivered:", error.message);
        }
      }
      return res.status(202).json({
        message: "If an account exists for this email, a verification code has been sent.",
        challengeId,
        email,
        resendAvailableAt: resendTime(resendAvailableAt)
      });
    } catch (error) {
      return next(error);
    }
  },
  async resendPasswordResetOtp(req, res, next) {
    const challengeId = typeof req.body.challengeId === "string" ? req.body.challengeId : "";
    if (!challengeId) return res.status(400).json({ message: "A password reset session is required." });
    try {
      const now = new Date();
      const otp = createOtp();
      const resendAvailableAt = new Date(Date.now() + ENV.OTP_RESEND_COOLDOWN_SECONDS * 1000);
      const reset = await PasswordReset.findOneAndUpdate(
        { challengeId, resendAvailableAt: { $lte: now }, verifiedAt: null },
        {
          $set: {
            otpHash: hashOtp(challengeId, otp),
            otpExpiresAt: new Date(Date.now() + ENV.PASSWORD_RESET_OTP_EXPIRES_MINUTES * 60 * 1000),
            attempts: 0,
            resendAvailableAt
          }
        },
        { new: true }
      );
      if (!reset) {
        const current = await PasswordReset.findOne({ challengeId });
        if (!current) return res.status(404).json({ message: "This password reset session has expired." });
        return res.status(429).json({ message: "Please wait before requesting another code.", resendAvailableAt: resendTime(current.resendAvailableAt) });
      }
      if (await User.exists({ email: reset.email })) {
        try {
          await sendPasswordResetOtp(reset.email, otp);
        } catch (error) {
          await PasswordReset.deleteOne({ _id: reset._id });
          console.warn("[Auth] Password reset email was not delivered:", error.message);
        }
      }
      return res.json({ email: reset.email, resendAvailableAt: resendTime(resendAvailableAt) });
    } catch (error) {
      return next(error);
    }
  },
  async verifyPasswordResetOtp(req, res, next) {
    const challengeId = typeof req.body.challengeId === "string" ? req.body.challengeId : "";
    const otp = typeof req.body.otp === "string" ? req.body.otp : "";
    if (!challengeId || !/^\d{4}$/.test(otp)) return res.status(400).json({ message: "Enter the four-digit verification code." });
    try {
      const reset = await PasswordReset.findOne({ challengeId });
      if (!reset || !reset.otpHash || reset.otpExpiresAt <= new Date()) {
        return res.status(400).json({ message: "This verification code is invalid or expired." });
      }
      if (reset.attempts >= ENV.OTP_MAX_ATTEMPTS) return res.status(429).json({ message: "Too many incorrect attempts. Request a new code." });
      const matches = crypto.timingSafeEqual(Buffer.from(reset.otpHash), Buffer.from(hashOtp(challengeId, otp)));
      if (!matches) {
        await PasswordReset.updateOne({ _id: reset._id }, { $inc: { attempts: 1 } });
        return res.status(400).json({ message: "This verification code is invalid or expired." });
      }
      const verified = await PasswordReset.findOneAndUpdate(
        { _id: reset._id, otpHash: reset.otpHash, attempts: { $lt: ENV.OTP_MAX_ATTEMPTS }, verifiedAt: null },
        { $set: { verifiedAt: new Date(), otpHash: null, otpExpiresAt: null } },
        { new: true }
      );
      if (!verified) return res.status(400).json({ message: "This verification code is invalid or expired." });
      return res.json({ challengeId, email: verified.email });
    } catch (error) {
      return next(error);
    }
  },
  async resetPassword(req, res, next) {
    const challengeId = typeof req.body.challengeId === "string" ? req.body.challengeId : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!challengeId || password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
    }
    try {
      const reset = await PasswordReset.findOneAndDelete({ challengeId, verifiedAt: { $ne: null } });
      if (!reset) return res.status(400).json({ message: "Verify the email code before setting a new password." });
      const user = await User.findOneAndUpdate(
        { email: reset.email },
        { $set: { passwordHash: await bcrypt.hash(password, 12) }, $inc: { sessionVersion: 1 } },
        { new: true }
      );
      if (!user) return res.status(400).json({ message: "Unable to reset the password." });
      return res.json({ message: "Password updated successfully." });
    } catch (error) {
      return next(error);
    }
  },
  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      return res.json({ user: publicUser(user), token: createToken(user) });
    } catch (error) {
      return next(error);
    }
  },
  async getCurrentUser(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user: publicUser(user) });
    } catch (error) {
      return next(error);
    }
  }
};
