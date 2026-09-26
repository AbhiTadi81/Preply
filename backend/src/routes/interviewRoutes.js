/**
 * Interview Routes
 * 
 * Defines protected endpoints for managing interview sessions:
 * - POST /            : Start new interview session (parses resume & generates questions)
 * - GET /             : List all interview sessions for the logged-in user
 * - GET /:id          : Get details of a specific interview session
 * - POST /:id/answer  : Submit an answer to a question for AI evaluation
 * - GET /:id/report   : Fetch or generate the final interview report
 */

import { Router } from "express";
import { interviewController } from "../controllers/interviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.use(requireAuth);
router.post("/", interviewController.createSession);
router.get("/", interviewController.getAllSessions);
router.get("/:id", interviewController.getSession);
router.get("/:id/report", interviewController.getFinalReport);
router.post("/:id/answer", interviewController.submitAnswer);
export default router;
