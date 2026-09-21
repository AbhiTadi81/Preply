import { apiFetch } from "./api";
export const reportService = {
  async getTodayReport() {
    try {
      return await apiFetch("/reports/today");
    } catch {
      const defaultReport = {
        id: "rep_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        userId: "usr_local",
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
          "Skipping lexical scope definition when explaining closures",
          "Forgetting catch handlers in raw Promise chains"
        ]
      };
      return defaultReport;
    }
  },
  async getHistory() {
    try {
      return await apiFetch("/reports/history");
    } catch {
      return [
        await this.getTodayReport(),
        {
          id: "rep_yesterday",
          userId: "usr_local",
          date: new Date(Date.now() - 864e5).toISOString(),
          overallScore: 71,
          interviewsCount: 2,
          questionsCount: 20,
          skillPerformance: [
            { skill: "JavaScript", score: 75 },
            { skill: "React", score: 62 },
            { skill: "Node.js", score: 58 },
            { skill: "SQL", score: 88 }
          ],
          strongAreas: ["SQL queries", "Basic algorithms"],
          weakAreas: ["React state synchronization", "Error handling middleware"],
          recommendedPractice: ["React Lifecycle & Effects", "Express Error Handlers"]
        }
      ];
    }
  }
};
