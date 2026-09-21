import dotenv from "dotenv";
dotenv.config();
export const ENV = {
  PORT: process.env.PORT || 3e3,
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "preply_super_secret_jwt_key_2026",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/preply",
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"
};
