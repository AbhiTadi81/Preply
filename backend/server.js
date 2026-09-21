import express from "express";
import path from "path";
import { connectDB } from "./server/config/db.js";
import authRoutes from "./server/routes/authRoutes.js";
import interviewRoutes from "./server/routes/interviewRoutes.js";
import reportRoutes from "./server/routes/reportRoutes.js";
import { authMiddleware, errorMiddleware } from "./server/middleware/authMiddleware.js";
import { ENV } from "./server/config/env.js";
async function startServer() {
  const app = express();
  const PORT = Number(ENV.PORT) || 3e3;
  app.use(express.json());
  await connectDB();
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Preply API", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
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
