/**
 * Report Service
 * 
 * Responsibilities:
 * - Communicates with backend /api/reports endpoints to fetch daily reports and history.
 * - Provides graceful local fallback data for uninterrupted user experience if offline.
 */

import { apiFetch, apiDownload } from "./api";
export const reportService = {
  async getTodayReport() {
    return apiFetch("/reports/today");
  },
  async getHistory() {
    return apiFetch("/reports/history");
  },
  downloadReport(id) {
    return apiDownload(`/reports/interviews/${id}/report.pdf`, `preply-report-${id}.pdf`);
  },
  downloadResume(id) {
    return apiDownload(`/reports/interviews/${id}/resume`, `preply-resume-${id}.txt`);
  },
};
