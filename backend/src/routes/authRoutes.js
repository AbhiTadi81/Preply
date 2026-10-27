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
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/forgot-password/resend-otp", authController.resendPasswordResetOtp);
router.post("/forgot-password/verify-otp", authController.verifyPasswordResetOtp);
router.post("/forgot-password/reset", authController.resetPassword);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.getCurrentUser);
router.patch("/me", requireAuth, authController.updateProfile);
router.patch("/change-password", requireAuth, authController.changePassword);
export default router;
