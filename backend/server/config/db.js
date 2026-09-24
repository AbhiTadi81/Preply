import mongoose from "mongoose";
import { ENV } from "./env.js";

// Tracks the live connection state for use by the health endpoint.
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
    dbState.lastError = err.message;
    console.error("[DB] MongoDB connection error:", err.message);
  });

  // Throw on startup failure so the server can report it clearly.
  await mongoose.connect(ENV.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
}
