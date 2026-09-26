/**
 * Express Application Setup
 * 
 * Responsibilities:
 * - Configures security middleware (CORS with configurable allowed origin).
 * - Parses incoming JSON payloads.
 * - Exposes health monitoring at /api/health (returns only safe status info).
 * - Mounts modular API routers: /api/auth, /api/interviews, /api/reports.
 * - Exposes APIs only: returns JSON 404 for unmatched paths (does not serve frontend files).
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { authMiddleware, errorMiddleware } from "./middleware/authMiddleware.js";
import { dbState } from "./config/db.js";
import { ENV } from "./config/env.js";

const app = express();

// 1. CORS Configuration: allow frontend to make authenticated API requests
const allowedOrigins = ENV.FRONTEND_URL
  ? ENV.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        (ENV.NODE_ENV !== "production" && origin.startsWith("http://localhost:"))
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 2. Parse incoming JSON requests with a reasonable limit for resume uploads
app.use(express.json({ limit: "15mb" }));

// 3. Safe health check endpoint for monitoring (never leaks internal paths or connection strings)
app.get("/api/health", (req, res) => {
  const isHealthy = dbState.connected;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    service: "Preply Backend API",
    database: isHealthy ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// 4. Authentication middleware: extracts and verifies JWT bearer tokens
app.use(authMiddleware);

// 5. REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/reports", reportRoutes);

// 6. Global error handling middleware (sanitizes error messages in production)
app.use(errorMiddleware);

// 7. 404 handler for unknown routes (backend exposes APIs only)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
