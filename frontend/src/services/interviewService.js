import { apiFetch } from "./api";

export const interviewService = {
  async createSession(options = {}) {
    const session = await apiFetch("/interviews", {
      method: "POST",
      body: JSON.stringify({
        resumeFileName: options.resumeFileName || "Resume.pdf",
        resumeContent: options.resumeContent || "",
        questionCount: options.questionCount || 5,
        difficulty: (options.difficulty || "medium").toLowerCase(),
        targetRole: options.targetRole || options.role || "Full Stack & Software Engineer"
      })
    });
    localStorage.setItem("preply_current_session_id", session.id);
    return session;
  },

  async submitAnswer(sessionId, questionId, transcript, questionText) {
    const response = await apiFetch(`/interviews/${sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ questionId, transcript, question: questionText })
    });
    return {
      score: response.evaluation?.overallScore,
      feedback: response.evaluation?.feedback,
      evaluation: response.evaluation,
      session: response.session
    };
  },

  getFinalReport(sessionId) {
    return apiFetch(`/interviews/${sessionId}/report`);
  },

  getSession(id) {
    return apiFetch(`/interviews/${id}`);
  },

  getAllSessions() {
    return apiFetch("/interviews");
  },

  getCurrentSession() {
    return null;
  }
};
