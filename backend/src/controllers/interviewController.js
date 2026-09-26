import { Answer } from "../models/Answer.js";
import { Interview } from "../models/Interview.js";
import { Question } from "../models/Question.js";
import { Report } from "../models/Report.js";
import { Resume } from "../models/Resume.js";
import { aiService } from "../services/aiService.js";

const difficultyValues = ["easy", "medium", "hard"];

function serializeQuestion(question) {
  return {
    id: question._id,
    question: question.question,
    type: question.type,
    topic: question.topic,
    difficulty: question.difficulty,
    expectedConcepts: question.expectedConcepts,
    order: question.order
  };
}

async function sessionPayload(interview) {
  const [questions, answers] = await Promise.all([
    Question.find({ interviewId: interview._id }).sort({ order: 1 }),
    Answer.find({ interviewId: interview._id }).sort({ createdAt: 1 })
  ]);
  return {
    id: interview._id,
    userId: interview.userId,
    resumeId: interview.resumeId,
    role: interview.targetRole,
    targetRole: interview.targetRole,
    difficulty: interview.difficulty,
    questionCount: questions.length,
    questions: questions.map(serializeQuestion),
    currentQuestionIndex: answers.length,
    answers,
    status: interview.status,
    overallScore: interview.overallScore,
    createdAt: interview.startedAt,
    completedAt: interview.completedAt
  };
}

export const interviewController = {
  async createSession(req, res, next) {
    try {
      const { resumeFileName = "Resume.pdf", resumeContent = "", questionCount = 5 } = req.body;
      const targetRole = req.body.targetRole || req.body.role;
      const difficulty = String(req.body.difficulty || "medium").toLowerCase();
      const count = Math.min(20, Math.max(1, Number(questionCount) || 5));
      if (!targetRole) return res.status(400).json({ message: "Target role is required" });
      if (!resumeContent.trim()) return res.status(400).json({ message: "Resume text is required" });
      if (!difficultyValues.includes(difficulty)) return res.status(400).json({ message: "Difficulty must be easy, medium, or hard" });

      const parsedResume = await aiService.parseResume(resumeContent);
      const resume = await Resume.create({
        userId: req.user.id,
        fileName: resumeFileName,
        rawText: resumeContent,
        ...parsedResume
      });
      const interview = await Interview.create({
        userId: req.user.id,
        resumeId: resume._id,
        targetRole,
        difficulty
      });
      const questions = [];
      for (let index = 0; index < count; index += 1) {
        const generated = await aiService.generateQuestion({
          resume: parsedResume,
          targetRole,
          difficulty,
          previousQuestions: questions.map((item) => item.question),
          previousAnswers: [],
          questionNumber: index + 1
        });
        const normalizedQuestion = String(generated.question || "").trim();
        const duplicate = questions.some((item) => item.question.toLowerCase() === normalizedQuestion.toLowerCase());
        const questionText = duplicate
          ? `Based on your resume, what was a different challenge you faced with ${generated.topic || targetRole}, and how did you resolve it?`
          : normalizedQuestion;
        questions.push(await Question.create({
          interviewId: interview._id,
          question: questionText,
          type: generated.type || "resume_project",
          topic: generated.topic,
          difficulty,
          expectedConcepts: generated.expectedConcepts || [],
          order: index + 1
        }));
      }
      return res.status(201).json(await sessionPayload(interview));
    } catch (error) {
      return next(error);
    }
  },

  async getSession(req, res, next) {
    try {
      const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
      if (!interview) return res.status(404).json({ message: "Interview session not found" });
      return res.json(await sessionPayload(interview));
    } catch (error) {
      return next(error);
    }
  },

  async getAllSessions(req, res, next) {
    try {
      const interviews = await Interview.find({ userId: req.user.id }).sort({ startedAt: -1 });
      return res.json(await Promise.all(interviews.map(sessionPayload)));
    } catch (error) {
      return next(error);
    }
  },

  async submitAnswer(req, res, next) {
    try {
      const { questionId, transcript } = req.body;
      if (!transcript?.trim()) return res.status(400).json({ message: "Transcript is required" });
      const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
      const question = await Question.findOne({ _id: questionId, interviewId: req.params.id });
      if (!interview || !question) return res.status(404).json({ message: "Interview question not found" });
      const resume = await Resume.findOne({ _id: interview.resumeId, userId: req.user.id });
      const evaluation = await aiService.evaluateAnswer({
        resume,
        question: question.question,
        expectedConcepts: question.expectedConcepts,
        answer: transcript.trim(),
        targetRole: interview.targetRole
      });
      await Answer.create({ interviewId: interview._id, questionId: question._id, transcript: transcript.trim(), ...evaluation });
      const answeredCount = await Answer.countDocuments({ interviewId: interview._id });
      const totalQuestions = await Question.countDocuments({ interviewId: interview._id });
      if (answeredCount >= totalQuestions) {
        const answers = await Answer.find({ interviewId: interview._id }).sort({ createdAt: 1 });
        interview.status = "completed";
        interview.completedAt = new Date();
        try {
          const reportData = await aiService.generateReport({ resume, questions: await Question.find({ interviewId: interview._id }).sort({ order: 1 }), answers, evaluations: answers, targetRole: interview.targetRole });
          await Report.findOneAndUpdate({ interviewId: interview._id }, { interviewId: interview._id, userId: req.user.id, ...reportData }, { upsert: true, new: true, setDefaultsOnInsert: true });
          interview.overallScore = reportData.overallScore;
        } catch (reportError) {
          console.error("Final report generation deferred:", reportError);
        }
        await interview.save();
      }
      return res.json({ evaluation, session: await sessionPayload(interview) });
    } catch (error) {
      return next(error);
    }
  },

  async getFinalReport(req, res, next) {
    try {
      const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
      if (!interview) return res.status(404).json({ message: "Interview session not found" });
      let report = await Report.findOne({ interviewId: interview._id, userId: req.user.id });
      if (!report) {
        const [resume, questions, answers] = await Promise.all([
          Resume.findOne({ _id: interview.resumeId, userId: req.user.id }),
          Question.find({ interviewId: interview._id }).sort({ order: 1 }),
          Answer.find({ interviewId: interview._id }).sort({ createdAt: 1 })
        ]);
        if (!resume || answers.length < questions.length) {
          return res.status(409).json({ message: "Complete every interview question before requesting the final report" });
        }
        const reportData = await aiService.generateReport({
          resume,
          questions,
          answers,
          evaluations: answers,
          targetRole: interview.targetRole
        });
        report = await Report.create({ interviewId: interview._id, userId: req.user.id, ...reportData });
      }
      return res.json(report);
    } catch (error) {
      return next(error);
    }
  }
};
