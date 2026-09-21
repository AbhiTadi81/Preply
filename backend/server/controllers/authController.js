import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../config/env.js";

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email }, ENV.JWT_SECRET, { expiresIn: "7d" });
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

export const authController = {
  async register(req, res, next) {
    const { name, email, password, targetRole } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) return res.status(409).json({ message: "A user with this email already exists" });
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 12),
        targetRole: targetRole || "Frontend Developer"
      });
      return res.status(201).json({ user: publicUser(user), token: createToken(user) });
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
