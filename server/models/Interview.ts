// Interview Session Model
import { IQuestion } from './Question';

export type CoverageStatus = 'Tested' | 'Partially Tested' | 'Not Tested';

export interface IResumeCoverageItem {
  skill: string;
  topic?: string;
  status: CoverageStatus;
  finalFeedback: string;
  nextPracticeRecommendation: string;
}

export interface IFinalInterviewReport {
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
  resumeCoverage?: IResumeCoverageItem[];
  createdAt: string;
}

export interface IInterview {
  _id: string;
  userId: string;
  role: string;
  topics: string[];
  resumeFileName?: string;
  resumeContent?: string;
  questionCount?: number;
  questions: IQuestion[];
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed';
  overallScore?: number;
  finalReport?: IFinalInterviewReport;
  createdAt: string;
  completedAt?: string;
}

export const interviewsStore: IInterview[] = [];
