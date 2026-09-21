import { Router } from "express";
import { reportController } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.use(requireAuth);
router.get("/today", reportController.getTodayReport);
router.get("/history", reportController.getHistory);
export default router;
