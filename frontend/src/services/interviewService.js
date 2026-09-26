/**
 * Interview Service
 * 
 * Responsibilities:
 * - Communicates with backend /api/interviews endpoints.
 * - Handles creating sessions, submitting answers for evaluation, and retrieving final reports.
 * - Manages active interview session caching in localStorage.
 */

import { apiFetch } from "./api";

const CURRENT_SESSION_ID_KEY = "preply_current_session_id";
const CURRENT_SESSION_KEY = "preply_current_session";

export const interviewService = {
  getCurrentSessionId() {
    return localStorage.getItem(CURRENT_SESSION_ID_KEY) || null;
  },

  getCurrentSession() {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        // ignore parse error
      }
    }
    const currentId = this.getCurrentSessionId();
    return currentId ? { id: currentId } : null;
  },

  saveCurrentSession(session) {
    if (!session) return;
    const id = session.id || session._id;
    if (id) {
      localStorage.setItem(CURRENT_SESSION_ID_KEY, String(id));
    }
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore storage quota error
    }
  },

  clearCurrentSession() {
    localStorage.removeItem(CURRENT_SESSION_ID_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

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
    this.saveCurrentSession(session);
    return session;
  },

  async submitAnswer(sessionId, questionId, transcript, questionText) {
    const response = await apiFetch(`/interviews/${sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ questionId, transcript, question: questionText })
    });
    if (response.session) {
      this.saveCurrentSession(response.session);
    }
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

  async getSession(id) {
    const session = await apiFetch(`/interviews/${id}`);
    if (session) {
      this.saveCurrentSession(session);
    }
    return session;
  },

  getAllSessions() {
    return apiFetch("/interviews");
  }
};

