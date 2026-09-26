/**
 * Answer Model
 * 
 * Stores a candidate's answer to a specific interview question along with
 * the AI-evaluated scores (technical, clarity, completeness), missing concepts, and feedback.
 */

import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
	interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true },
	questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
	transcript: { type: String, required: true },
	technicalScore: Number,
	clarityScore: Number,
	completenessScore: Number,
	overallScore: Number,
	missingConcepts: [String],
	resumeClaim: String,
	claimUnderstanding: String,
	feedback: String
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);
