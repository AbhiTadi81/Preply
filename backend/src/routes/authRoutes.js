/**
 * Authentication Routes
 * 
 * Defines endpoints for registering, logging in, and fetching current user info.
 * Public routes: POST /register, POST /login
 * Protected routes: GET /me
 */

import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.getCurrentUser);
export default router;
