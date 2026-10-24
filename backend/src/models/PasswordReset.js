import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  challengeId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  otpHash: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  attempts: { type: Number, default: 0 },
  resendAvailableAt: { type: Date, required: true },
  verifiedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, expires: 900 }
}, { versionKey: false });

export const PasswordReset = mongoose.models.PasswordReset
  || mongoose.model("PasswordReset", passwordResetSchema);
