/**
 * HTTP Server Entry Point
 *
 * Responsibilities:
 * - Connects to the MongoDB database.
 * - Starts the Express HTTP server on the configured port.
 * - The actual Express app setup (middleware, routes) lives in app.js.
 */

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function startServer() {
  const PORT = ENV.PORT || 5000;

  try {
    await connectDB();
  } catch (error) {
    // Warn rather than crash — allows the health endpoint to report degraded status
    console.warn("[DB] Warning: Initial MongoDB connection failed:", error.message);
    console.warn("[DB] Server will run in degraded mode. Whitelist your IP in MongoDB Atlas or fix MONGODB_URI.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Preply] Backend API running on http://0.0.0.0:${PORT}`);
    console.log(`[Preply] Allowed Frontend Origin: ${ENV.FRONTEND_URL}`);
    console.log(`[Preply] AI Service URL: ${ENV.AI_SERVICE_URL}`);
  });
}

startServer();
