// Global TypeScript definitions for Preply interview platform

export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  role: string;
  topic: string;
  subtopic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer?: string;
}

export interface AnswerEvaluation {
  score?: number;
  technicalScore: number;
  clarityScore: number;
  completenessScore: number;
  overallScore: number;
  answerRelevanceScore?: number;
  projectKnowledgeScore?: number;
  missingConcepts: string[];
  feedback: string;
  topic: string;
  subtopic: string;
}

export interface AnswerFeedback {
  score: number;
  feedback: string;
  evaluation?: AnswerEvaluation;
}

export interface UserAnswer {
  questionId: string;
  questionText: string;
  transcript: string;
  durationSeconds: number;
  evaluation?: AnswerEvaluation;
  submittedAt: string;
}

export type CoverageStatus = 'Tested' | 'Partially Tested' | 'Not Tested';

export interface ResumeCoverageItem {
  skill: string;
  topic?: string;
  status: CoverageStatus;
  finalFeedback: string;
  nextPracticeRecommendation: string;
}

export interface FinalInterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalKnowledgeScore: number;
  projectKnowledgeScore: number;
  communicationScore: number;
  answerRelevanceScore: number;
  strengths: string[];
  areasToImprove: string[];
  overallFeedback: string;
  recommendedPractice: string[];
  resumeCoverage?: ResumeCoverageItem[];
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  topics: string[];
  resumeFileName?: string;
  questionCount?: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  status: 'in_progress' | 'completed';
  overallScore?: number;
  finalReport?: FinalInterviewReport;
  createdAt: string;
  completedAt?: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string;
  overallScore: number;
  interviewsCount: number;
  questionsCount: number;
  skillPerformance: {
    skill: string;
    score: number;
  }[];
  strongAreas: string[];
  weakAreas: string[];
  recommendedPractice: string[];
  repeatedMistakes?: string[];
}

