import { ENV } from "../config/env.js";

async function callAI(path, payload) {
  const response = await fetch(`${ENV.AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.detail || `AI service returned ${response.status}`);
  }
  return body;
}

export const aiService = {
  parseResume(resumeText) {
    return callAI("/api/resume/parse", { resume_text: resumeText });
  },
  generateQuestion(payload) {
    return callAI("/api/interview/generate-question", payload);
  },
  evaluateAnswer(payload) {
    return callAI("/api/interview/evaluate-answer", payload);
  },
  generateReport(payload) {
    return callAI("/api/interview/generate-report", payload);
  }
};
