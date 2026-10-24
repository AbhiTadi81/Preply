import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
  challengeId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, required: true },
  otpHash: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  resendAvailableAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }
}, { versionKey: false });

export const PendingRegistration = mongoose.models.PendingRegistration
  || mongoose.model("PendingRegistration", pendingRegistrationSchema);
