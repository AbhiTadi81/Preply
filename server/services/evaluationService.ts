import {
  evaluateCandidateAnswer,
  generateFinalInterviewReport,
  StructuredEvaluation,
} from './llmService';
import { IAnswer, answersStore } from '../models/Answer';
import { interviewsStore, IInterview, IFinalInterviewReport } from '../models/Interview';

export const evaluationService = {
  async evaluateAndStore(
    interviewId: string,
    questionId: string,
    transcript: string,
    questionTextOverride?: string
  ): Promise<{ evaluation: StructuredEvaluation; interview: IInterview }> {
    const interview = interviewsStore.find((i) => i._id === interviewId);
    if (!interview) {
      throw new Error('Interview session not found');
    }

    const currentQ =
      interview.questions.find((q) => q._id === questionId) ||
      interview.questions[interview.currentQuestionIndex];
    const topic = currentQ?.topic || 'General';
    const subtopic = currentQ?.subtopic || 'General';
    const questionText = questionTextOverride || currentQ?.question || 'Technical Question';

    // 1. Invoke isolated LLM evaluator
    const evaluation = await evaluateCandidateAnswer(
      questionText,
      transcript,
      topic,
      subtopic
    );

    // 2. Store answer record
    const newAnswer: IAnswer = {
      _id: 'ans_' + Date.now(),
      interviewId,
      questionId,
      questionText,
      transcript,
      durationSeconds: 40,
      technicalScore: evaluation.technicalScore,
      clarityScore: evaluation.clarityScore,
      completenessScore: evaluation.completenessScore,
      overallScore: evaluation.overallScore,
      missingConcepts: evaluation.missingConcepts,
      feedback: evaluation.feedback,
      topic,
      subtopic,
      createdAt: new Date().toISOString(),
    };
    answersStore.push(newAnswer);

    // 3. Update interview progress
    if (interview.currentQuestionIndex + 1 >= interview.questions.length) {
      interview.status = 'completed';
      interview.completedAt = new Date().toISOString();

      const sessionAnswers = answersStore.filter((a) => a.interviewId === interviewId);
      const avg =
        sessionAnswers.reduce((sum, a) => sum + a.overallScore * 10, 0) /
        (sessionAnswers.length || 1);
      interview.overallScore = Math.round(avg);

      try {
        interview.finalReport = await generateFinalInterviewReport(interview, sessionAnswers);
      } catch (e) {
        console.warn('Failed to pre-generate final report:', e);
      }
    } else {
      interview.currentQuestionIndex += 1;
    }

    return { evaluation, interview };
  },

  async getOrGenerateFinalReport(interviewId: string): Promise<IFinalInterviewReport> {
    const interview = interviewsStore.find((i) => i._id === interviewId);
    if (!interview) {
      throw new Error('Interview session not found');
    }

    if (interview.finalReport) {
      return interview.finalReport;
    }

    const sessionAnswers = answersStore.filter((a) => a.interviewId === interviewId);
    const report = await generateFinalInterviewReport(interview, sessionAnswers);
    interview.finalReport = report;
    return report;
  },
};

