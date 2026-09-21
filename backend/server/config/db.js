import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("[DB] MongoDB connected");
  } catch (error) {
    console.warn("[DB] MongoDB unavailable; starting with database-backed features disabled.", error.message);
  }
}
