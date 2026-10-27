
/**
 * Express Application Setup
 *
 * Responsibilities:
 * - Configures CORS for Vercel deployments and configurable frontend origins.
 * - Parses incoming JSON payloads.
 * - Exposes health monitoring at /api/health.
 * - Mounts modular API routers: /api/auth, /api/interviews, /api/reports.
 * - Exposes APIs only; returns JSON 404 for unmatched paths.
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { authMiddleware, errorMiddleware } from "./middleware/authMiddleware.js";
import { dbState } from "./config/db.js";
import { ENV } from "./config/env.js";
import rateLimit from "express-rate-limit";

const app = express();

// 1. CORS Configuration
const allowedOrigins = (ENV.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. curl or server-to-server).
      if (!origin) {
        return callback(null, true);
      }

      let parsedUrl;

      try {
        parsedUrl = new URL(origin);
      } catch {
        return callback(new Error("Invalid CORS origin"));
      }

      const hostname = parsedUrl.hostname.toLowerCase();

      // Allow local development.
      const isLocalhost =
        ENV.NODE_ENV !== "production" &&
        parsedUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(hostname);

      // Allow HTTPS Vercel deployments and previews.
      const isVercel =
        parsedUrl.protocol === "https:" &&
        (hostname === "vercel.app" ||
          hostname.endsWith(".vercel.app"));

      // Allow explicitly configured frontend origins, including future custom domains.
      const isConfiguredOrigin =
        allowedOrigins.includes(origin);

      if (isLocalhost || isVercel || isConfiguredOrigin) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy violation: Origin ${origin} not allowed`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Parse incoming JSON requests.
app.use(express.json({ limit: "15mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests. Please try again later.",
  },
});

app.use("/api/auth", authLimiter);

const aiRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // Session/history reads do not call the AI service. Keep the limit focused
  // on interview creation, answer evaluation, and report generation.
  skip: (req) => req.method === "GET" && !req.path.endsWith("/report"),
  message: {
    message: "Too many AI requests. Please try again later.",
  },
});

app.use("/api/interviews", aiRequestLimiter);

// 3. Health check.
app.get("/api/health", (req, res) => {
  const isHealthy = dbState.connected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    service: "Preply Backend API",
    database: isHealthy ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 4. Authentication middleware.
app.use(authMiddleware);

// 5. REST API routes.
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/reports", reportRoutes);

// 6. Global error handling.
app.use(errorMiddleware);

// 7. 404 handler.
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
