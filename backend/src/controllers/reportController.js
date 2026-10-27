/**
 * Report Controller
 * 
 * Responsibilities:
 * - Fetches the latest evaluation report for the current user.
 * - Fetches historical interview reports for progress tracking.
 */

import { Report } from "../models/Report.js";
import { Interview } from "../models/Interview.js";
import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";
import { Resume } from "../models/Resume.js";
export const reportController = {
  async getTodayReport(req, res, next) {
    try {
      const report = await Report.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      if (!report) return res.status(404).json({ message: "No interview report found" });
      return res.json(report);
    } catch (error) {
      return next(error);
    }
  },
  async getHistory(req, res, next) {
    try {
      const interviews = await Interview.find({ userId: req.user.id }).sort({ startedAt: -1 }).lean();
      const result = await Promise.all(interviews.map(async (interview) => {
        const [report, answers, questionCount] = await Promise.all([
          Report.findOne({ interviewId: interview._id, userId: req.user.id }).lean(),
          Answer.countDocuments({ interviewId: interview._id }),
          Question.countDocuments({ interviewId: interview._id })
        ]);
        return {
          ...interview,
          id: interview._id,
          answeredQuestions: answers,
          questionCount,
          report: report || null,
          duration: interview.completedAt && interview.startedAt
            ? Math.round((new Date(interview.completedAt) - new Date(interview.startedAt)) / 60000)
            : null
        };
      }));
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  },
  async deleteInterview(req, res, next) {
    try {
      const interview = await Interview.findOne({
        _id: req.params.id,
        userId: req.user.id,
        status: "in_progress"
      });
      if (!interview) return res.status(404).json({ message: "In-progress interview not found" });
      await Promise.all([
        Question.deleteMany({ interviewId: interview._id }),
        Answer.deleteMany({ interviewId: interview._id }),
        Report.deleteMany({ interviewId: interview._id, userId: req.user.id }),
        Resume.deleteOne({ _id: interview.resumeId, userId: req.user.id })
      ]);
      await interview.deleteOne();
      return res.json({ message: "Interview deleted" });
    } catch (error) {
      return next(error);
    }
  },
  async downloadReport(req, res, next) {
    try {
      const report = await Report.findOne({ interviewId: req.params.id, userId: req.user.id }).lean();
      if (!report) return res.status(404).json({ message: "Report is not available for this interview" });
      const [questions, answers] = await Promise.all([
        Question.find({ interviewId: req.params.id }).sort({ order: 1 }).lean(),
        Answer.find({ interviewId: req.params.id }).sort({ createdAt: 1 }).lean()
      ]);
      const lines = [
        "Preply Interview Report",
        `Overall score: ${report.overallScore ?? "Not available"}`,
        `Technical score: ${report.technicalScore ?? "Not available"}`,
        `Clarity score: ${report.clarityScore ?? "Not available"}`,
        `Completeness score: ${report.completenessScore ?? "Not available"}`,
        "",
        `Strengths: ${(report.strongAreas || []).join(", ") || "Not available"}`,
        `Weaknesses: ${(report.weakAreas || []).join(", ") || "Not available"}`,
        `Skill gaps: ${(report.resumeGaps || []).concat(report.projectGaps || []).join(", ") || "Not available"}`,
        `Recommendations: ${(report.recommendations || []).join("; ") || "Not available"}`,
        "",
        "Question-level feedback:",
        ...questions.map((question, index) => {
          const answer = answers[index];
          return `${index + 1}. ${question.question} | Score: ${answer?.overallScore ?? "Not available"} | Feedback: ${answer?.feedback || "Not available"} | Skill gaps: ${(answer?.missingConcepts || []).join(", ") || "None"}`;
        })
      ];
      const escapePdf = (value) => value.replace(/[()\\]/g, "\\$&").slice(0, 110);
      const content = `BT /F1 11 Tf 50 760 Td ${lines.map((line) => `(${escapePdf(line)}) Tj 0 -16 Td`).join(" ")} ET`;
      const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length ${content.length}>>stream
${content}
endstream endobj
xref
0 6
0000000000 65535 f
trailer<</Size 6/Root 1 0 R>>
startxref
0
%%EOF`;
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="preply-report-${req.params.id}.pdf"` });
      return res.send(pdf);
    } catch (error) {
      return next(error);
    }
  },
  async downloadResume(req, res, next) {
    try {
      const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
      if (!interview) return res.status(404).json({ message: "Interview not found" });
      const resume = await Resume.findOne({ _id: interview.resumeId, userId: req.user.id });
      if (!resume) return res.status(404).json({ message: "Resume is not available" });
      res.set({ "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="${resume.fileName || "resume"}.txt"` });
      return res.send(`Resume export (the original uploaded file was not stored).\n\n${resume.rawText}`);
    } catch (error) {
      return next(error);
    }
  }
};
