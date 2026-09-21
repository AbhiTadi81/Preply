import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, default: "Frontend Developer" }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
