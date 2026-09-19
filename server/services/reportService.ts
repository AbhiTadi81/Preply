import { IDailyReport, dailyReportsStore, ISkillPerformance } from '../models/DailyReport';
import { answersStore } from '../models/Answer';
import { interviewsStore } from '../models/Interview';

export const reportService = {
  getTodayReport(userId: string): IDailyReport {
    // 1. Gather all answers for this user/session today
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const userInterviews = interviewsStore.filter((i) => i.userId === userId || userId === 'usr_default');
    const userInterviewIds = new Set(userInterviews.map((i) => i._id));
    const userAnswers = answersStore.filter((a) => userInterviewIds.has(a.interviewId));

    if (userAnswers.length === 0) {
      // Return populated benchmark report
      return dailyReportsStore[0];
    }

    // 2. Aggregate by topic
    const topicScores: Record<string, { total: number; count: number }> = {};
    let totalScoreSum = 0;

    userAnswers.forEach((ans) => {
      const topic = ans.topic || 'General';
      const score = (ans.overallScore || 7) * 10;
      totalScoreSum += score;

      if (!topicScores[topic]) {
        topicScores[topic] = { total: 0, count: 0 };
      }
      topicScores[topic].total += score;
      topicScores[topic].count += 1;
    });

    const skillPerformance: ISkillPerformance[] = Object.entries(topicScores).map(([skill, data]) => ({
      skill,
      score: Math.round(data.total / data.count),
    }));

    // Strong areas (>= 80%) & weak areas (< 75%)
    const strongAreas = skillPerformance
      .filter((s) => s.score >= 75)
      .map((s) => `${s.skill} fundamentals`);

    const weakAreas = skillPerformance
      .filter((s) => s.score < 75)
      .map((s) => `${s.skill} concepts`);

    const recommendedPractice = (weakAreas.length > 0 ? weakAreas : ['React Hooks', 'Node.js Middleware']).slice(0, 3);

    const report: IDailyReport = {
      _id: 'rep_' + todayStr,
      userId,
      date: now.toISOString(),
      overallScore: Math.round(totalScoreSum / userAnswers.length),
      interviewsCount: userInterviews.length || 1,
      questionsCount: userAnswers.length,
      skillPerformance: skillPerformance.length > 0 ? skillPerformance : dailyReportsStore[0].skillPerformance,
      strongAreas: strongAreas.length > 0 ? strongAreas : ['SQL queries', 'MongoDB concepts'],
      weakAreas: weakAreas.length > 0 ? weakAreas : ['React Hooks', 'Node.js Middleware'],
      recommendedPractice,
      repeatedMistakes: [
        'Skipping lexical environment explanation when discussing closures',
        'Neglecting error handling in async promise chains',
      ],
      createdAt: now.toISOString(),
    };

    return report;
  },

  getHistory(userId: string): IDailyReport[] {
    const today = this.getTodayReport(userId);
    return [
      today,
      ...dailyReportsStore.filter((r) => r._id !== today._id),
    ];
  },
};
