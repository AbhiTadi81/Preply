import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
	targetRole: { type: String, required: true },
	difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
	status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
	startedAt: { type: Date, default: Date.now },
	completedAt: Date,
	overallScore: Number
}, { timestamps: true });

export const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);
