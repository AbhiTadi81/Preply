/**
 * Authentication Middleware
 *
 * - authMiddleware: Runs on every request. If a valid JWT Bearer token is present,
 *   it attaches the decoded user payload to req.user. If invalid, it returns 401.
 *   Routes without a token still pass through — use requireAuth to enforce login.
 *
 * - requireAuth: Guards individual routes that need an authenticated user.
 *
 * - errorMiddleware: Global error handler. In production, never sends stack traces to clients.
 */

import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/User.js";
import { User } from "../models/User.js";

export async function authMiddleware(req, res, next) {
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // No token provided — let the request continue (public routes are fine)
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(payload.id).select("sessionVersion");
    if (!user || (payload.sessionVersion || 0) !== (user.sessionVersion || 0)) {
      return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}

export function requireAuth(req, res, next) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return next();
}

export function errorMiddleware(err, req, res, next) {
  // Always log the full error server-side for debugging
  console.error("[Server Error]", err.message);

  // In production, don't expose internal error details to the client
  const message =
    ENV.NODE_ENV === "production"
      ? "An unexpected server error occurred"
      : err.message || "An unexpected server error occurred";

  res.status(err.status || 500).json({ message });
}
