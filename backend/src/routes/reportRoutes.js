/**
 * Report Routes
 * 
 * Defines protected endpoints for performance reports:
 * - GET /today   : Latest interview report for the logged-in user
 * - GET /history : Complete historical reports list for progress tracking
 */

import { Router } from "express";
import { reportController } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.use(requireAuth);
router.get("/today", reportController.getTodayReport);
router.get("/history", reportController.getHistory);
router.delete("/interviews/:id", reportController.deleteInterview);
router.post("/interviews/:id/delete", reportController.deleteInterview);
router.get("/interviews/:id/report.pdf", reportController.downloadReport);
router.get("/interviews/:id/resume", reportController.downloadResume);
export default router;
