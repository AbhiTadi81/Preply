import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const reportController = {
  getTodayReport(req: Request, res: Response) {
    const userId = (req as unknown as { user?: { id: string } }).user?.id || 'usr_default';
    const report = reportService.getTodayReport(userId);
    return res.json({
      id: report._id,
      userId: report.userId,
      date: report.date,
      overallScore: report.overallScore,
      interviewsCount: report.interviewsCount,
      questionsCount: report.questionsCount,
      skillPerformance: report.skillPerformance,
      strongAreas: report.strongAreas,
      weakAreas: report.weakAreas,
      recommendedPractice: report.recommendedPractice,
      repeatedMistakes: report.repeatedMistakes,
    });
  },

  getHistory(req: Request, res: Response) {
    const userId = (req as unknown as { user?: { id: string } }).user?.id || 'usr_default';
    const history = reportService.getHistory(userId);
    return res.json(history);
  },
};
