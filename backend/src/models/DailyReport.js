export const dailyReportsStore = [
  {
    _id: "rep_default",
    userId: "usr_default",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    overallScore: 76,
    interviewsCount: 3,
    questionsCount: 35,
    skillPerformance: [
      { skill: "JavaScript", score: 82 },
      { skill: "React", score: 68 },
      { skill: "Node.js", score: 61 },
      { skill: "MongoDB", score: 84 },
      { skill: "SQL", score: 91 }
    ],
    strongAreas: ["SQL queries", "MongoDB concepts", "JavaScript fundamentals"],
    weakAreas: ["React Hooks", "Node.js Middleware", "Async Programming"],
    recommendedPractice: ["React Hooks", "Node.js Middleware", "Promises & Async/Await"],
    repeatedMistakes: [
      "Skipping lexical environment explanation when discussing closures",
      "Forgetting catch handlers in raw Promise chains"
    ],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
