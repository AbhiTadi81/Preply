/**
 * MongoDB Connection Setup
 *
 * Connects to the MongoDB database using the MONGODB_URI from environment variables.
 * Tracks the live connection state in dbState so the /api/health endpoint can report it.
 */

import mongoose from "mongoose";
import { ENV } from "./env.js";

// Shared connection state — read by the health endpoint in app.js
export const dbState = {
  connected: false,
  lastError: null
};

export async function connectDB() {
  mongoose.connection.on("connected", () => {
    dbState.connected = true;
    dbState.lastError = null;
    console.log("[DB] MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    dbState.connected = false;
    console.warn("[DB] MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    dbState.connected = false;
    // Only store the error message for health-endpoint reporting; never expose full error to clients
    dbState.lastError = err.message;
    console.error("[DB] MongoDB connection error:", err.message);
  });

  await mongoose.connect(ENV.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
}
