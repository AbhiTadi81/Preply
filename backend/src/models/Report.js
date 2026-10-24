/**
 * Report Model
 * 
 * Persists the final performance report for an interview session,
 * containing overall & category scores, skill breakdown, strengths, and recommendations.
 */

import mongoose from "mongoose";

export function normalizeSkillScores(skillScores) {
  if (!skillScores || typeof skillScores !== "object" || Array.isArray(skillScores)) {
    return {};
  }
  const entries = skillScores instanceof Map
    ? Array.from(skillScores.entries())
    : Object.entries(skillScores);
  return Object.fromEntries(
    entries.map(([skill, score]) => [skill, Number(score)])
  );
}

const reportSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overallScore: Number,
  technicalScore: Number,
  clarityScore: Number,
  completenessScore: Number,
  skillScores: { type: mongoose.Schema.Types.Mixed, default: {}, set: normalizeSkillScores },
  strongAreas: [String],
  weakAreas: [String],
  resumeGaps: [String],
  projectGaps: [String],
  repeatedMistakes: [String],
  recommendations: [String]
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
