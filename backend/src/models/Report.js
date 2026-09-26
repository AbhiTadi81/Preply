import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overallScore: Number,
  technicalScore: Number,
  clarityScore: Number,
  completenessScore: Number,
  skillScores: { type: Map, of: Number },
  strongAreas: [String],
  weakAreas: [String],
  resumeGaps: [String],
  projectGaps: [String],
  repeatedMistakes: [String],
  recommendations: [String]
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
