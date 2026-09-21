import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }
  try {
    const token = authHeader.slice(7);
    req.user = jwt.verify(token, ENV.JWT_SECRET);
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
  console.error("[Error Middleware]", err);
  res.status(500).json({
    message: err.message || "An unexpected server error occurred"
  });
}
