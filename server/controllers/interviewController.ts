import { Request, Response } from 'express';
import { interviewsStore, IInterview } from '../models/Interview';
import { evaluationService } from '../services/evaluationService';
import { generateInterviewQuestions } from '../services/llmService';

export const interviewController = {
  async createSession(req: Request, res: Response) {
    const {
      role = 'Full Stack & Software Engineer',
      topics = ['Project Architecture', 'System Design'],
      resumeFileName = 'Resume.pdf',
      resumeContent = '',
      questionCount = 5,
    } = req.body;

    const parsedCount = Math.min(20, Math.max(5, Number(questionCount) || 5));

    // Dynamically generate tailored interview questions based on resume & count
    const dynamicQuestions = await generateInterviewQuestions(
      resumeFileName,
      resumeContent,
      parsedCount
    );

    const newSession: IInterview = {
      _id: 'sess_' + Date.now(),
      userId: 'usr_default',
      role,
      topics,
      resumeFileName,
      resumeContent,
      questionCount: parsedCount,
      questions: dynamicQuestions,
      currentQuestionIndex: 0,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    };

    interviewsStore.unshift(newSession);

    return res.status(201).json({
      id: newSession._id,
      userId: newSession.userId,
      role: newSession.role,
      topics: newSession.topics,
      resumeFileName: newSession.resumeFileName,
      questionCount: newSession.questionCount,
      questions: newSession.questions.map((q) => ({
        id: q._id,
        role: q.role,
        topic: q.topic,
        subtopic: q.subtopic,
        question: q.question,
        difficulty: q.difficulty,
        sampleAnswer: q.sampleAnswer,
      })),
      currentQuestionIndex: newSession.currentQuestionIndex,
      answers: [],
      status: newSession.status,
      createdAt: newSession.createdAt,
    });
  },

  getSession(req: Request, res: Response) {
    const { id } = req.params;
    const session = interviewsStore.find((i) => i._id === id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.json({
      id: session._id,
      userId: session.userId,
      role: session.role,
      topics: session.topics,
      resumeFileName: session.resumeFileName,
      questionCount: session.questionCount || session.questions.length,
      questions: session.questions.map((q) => ({
        id: q._id,
        role: q.role,
        topic: q.topic,
        subtopic: q.subtopic,
        question: q.question,
        difficulty: q.difficulty,
        sampleAnswer: q.sampleAnswer,
      })),
      currentQuestionIndex: session.currentQuestionIndex,
      answers: [],
      status: session.status,
      overallScore: session.overallScore,
      createdAt: session.createdAt,
      finalReport: session.finalReport,
    });
  },

  getAllSessions(req: Request, res: Response) {
    return res.json(interviewsStore);
  },

  async submitAnswer(req: Request, res: Response) {
    const { id } = req.params;
    const { questionId, question, transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    try {
      const result = await evaluationService.evaluateAndStore(id, questionId, transcript, question);
      return res.json({
        score: result.evaluation.score,
        feedback: result.evaluation.feedback,
        evaluation: result.evaluation,
        session: {
          id: result.interview._id,
          userId: result.interview.userId,
          role: result.interview.role,
          topics: result.interview.topics,
          resumeFileName: result.interview.resumeFileName,
          questionCount: result.interview.questionCount,
          questions: result.interview.questions.map((q) => ({
            id: q._id,
            role: q.role,
            topic: q.topic,
            subtopic: q.subtopic,
            question: q.question,
            difficulty: q.difficulty,
            sampleAnswer: q.sampleAnswer,
          })),
          currentQuestionIndex: result.interview.currentQuestionIndex,
          answers: [],
          status: result.interview.status,
          overallScore: result.interview.overallScore,
          createdAt: result.interview.createdAt,
          finalReport: result.interview.finalReport,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Failed to evaluate answer' });
    }
  },

  async getFinalReport(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const report = await evaluationService.getOrGenerateFinalReport(id);
      return res.json(report);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Failed to load report' });
    }
  },
};

