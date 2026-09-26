/**
 * AI Service Client
 *
 * Provides a thin HTTP client that the backend uses to communicate with the
 * Python FastAPI AI service (ai-service/).
 *
 * The frontend never calls the AI service directly — all AI work goes through:
 *   Browser → Backend → AI Service
 *
 * This keeps the Gemini API key safely on the server, never exposed to the browser.
 */

import { ENV } from "../config/env.js";

// Internal helper: sends a POST request to the AI service and returns the parsed JSON body
async function callAI(path, payload) {
  const response = await fetch(`${ENV.AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // 60-second timeout for AI inference (LLM calls can be slow)
    signal: AbortSignal.timeout(60000)
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.detail || `AI service returned ${response.status}`);
  }

  return body;
}

export const aiService = {
  /** Parse resume text into a structured candidate profile */
  parseResume(resumeText) {
    return callAI("/api/resume/parse", { resume_text: resumeText });
  },

  /** Generate the next interview question based on resume, role, and difficulty */
  generateQuestion(payload) {
    return callAI("/api/interview/generate-question", payload);
  },

  /** Evaluate a candidate's answer and return a detailed score */
  evaluateAnswer(payload) {
    return callAI("/api/interview/evaluate-answer", payload);
  },

  /** Generate a final performance report for a completed interview session */
  generateReport(payload) {
    return callAI("/api/interview/generate-report", payload);
  }
};
