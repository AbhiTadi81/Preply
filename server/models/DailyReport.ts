// Daily AI Report Model
export interface ISkillPerformance {
  skill: string;
  score: number;
}

export interface IDailyReport {
  _id: string;
  userId: string;
  date: string;
  overallScore: number;
  interviewsCount: number;
  questionsCount: number;
  skillPerformance: ISkillPerformance[];
  strongAreas: string[];
  weakAreas: string[];
  recommendedPractice: string[];
  repeatedMistakes: string[];
  createdAt: string;
}

export const dailyReportsStore: IDailyReport[] = [
  {
    _id: 'rep_default',
    userId: 'usr_default',
    date: new Date().toISOString(),
    overallScore: 76,
    interviewsCount: 3,
    questionsCount: 35,
    skillPerformance: [
      { skill: 'JavaScript', score: 82 },
      { skill: 'React', score: 68 },
      { skill: 'Node.js', score: 61 },
      { skill: 'MongoDB', score: 84 },
      { skill: 'SQL', score: 91 },
    ],
    strongAreas: ['SQL queries', 'MongoDB concepts', 'JavaScript fundamentals'],
    weakAreas: ['React Hooks', 'Node.js Middleware', 'Async Programming'],
    recommendedPractice: ['React Hooks', 'Node.js Middleware', 'Promises & Async/Await'],
    repeatedMistakes: [
      'Skipping lexical environment explanation when discussing closures',
      'Forgetting catch handlers in raw Promise chains',
    ],
    createdAt: new Date().toISOString(),
  },
];
