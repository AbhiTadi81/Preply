/**
 * Backend Environment Configuration
 * 
 * Loads environment variables from backend/.env and validates critical secrets.
 * Fails fast if required secrets like JWT_SECRET are absent.
 */

import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const requiredProductionVariables = ["MONGODB_URI", "AI_SERVICE_URL", "FRONTEND_URL"];
if (isProduction) {
  const missing = requiredProductionVariables.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error(`[Config Error] Missing production environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// Ensure critical secrets are provided via environment variables (no hardcoded fallback)
if (!process.env.JWT_SECRET) {
  console.error("[Config Error] Fatal: JWT_SECRET environment variable is missing.");
  console.error("[Config Error] Please define JWT_SECRET in backend/.env before starting the server.");
  process.exit(1);
}

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/preply",
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  LOCAL_OTP_FALLBACK: process.env.LOCAL_OTP_FALLBACK === "true" || !isProduction,
  OTP_EXPIRES_MINUTES: 10,
  PASSWORD_RESET_OTP_EXPIRES_MINUTES: 5,
  OTP_RESEND_COOLDOWN_SECONDS: 60,
  OTP_MAX_ATTEMPTS: 5
};
