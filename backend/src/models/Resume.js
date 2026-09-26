import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  rawText: { type: String, required: true },
  skills: [String],
  projects: [mongoose.Schema.Types.Mixed],
  experience: [mongoose.Schema.Types.Mixed],
  education: [mongoose.Schema.Types.Mixed],
  certifications: [String]
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
