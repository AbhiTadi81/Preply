// Answer Model
export interface IAnswer {
  _id: string;
  interviewId: string;
  questionId: string;
  questionText: string;
  transcript: string;
  durationSeconds: number;
  technicalScore: number;
  clarityScore: number;
  completenessScore: number;
  overallScore: number;
  missingConcepts: string[];
  feedback: string;
  topic: string;
  subtopic: string;
  createdAt: string;
}

export const answersStore: IAnswer[] = [];
