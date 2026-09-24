import express from "express";
import path from "path";
import { connectDB, dbState } from "./server/config/db.js";
import authRoutes from "./server/routes/authRoutes.js";
import interviewRoutes from "./server/routes/interviewRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";
import { authMiddleware, errorMiddleware } from "./server/middleware/authMiddleware.js";
import { ENV } from "./server/config/env.js";

async function startServer() {
  const app = express();
  const PORT = Number(ENV.PORT) || 3000;
  app.use(express.json());

  try {
    await connectDB();
  } catch (error) {
    console.error("[DB] Fatal: could not connect to MongoDB at startup.", error.message);
    console.error("[DB] Resolve the database connection issue and restart the server.");
    process.exit(1);
  }

  app.get("/api/health", (req, res) => {
    const healthy = dbState.connected;
    const body = {
      status: healthy ? "ok" : "degraded",
      service: "Preply API",
      database: healthy ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    };
    if (!healthy && dbState.lastError) {
      body.databaseError = dbState.lastError;
    }
    res.status(healthy ? 200 : 503).json(body);
  });

  app.use(authMiddleware);
  app.use("/api/auth", authRoutes);
  app.use("/api/interviews", interviewRoutes);
  app.use("/api/reports", reportRoutes);
  app.use(errorMiddleware);

  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Preply] Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
