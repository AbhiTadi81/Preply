/**
 * Centralized API Fetch Utility
 * 
 * Responsibilities:
 * - Prepends the backend base URL configured via REACT_APP_API_URL.
 * - Automatically attaches the stored JWT token to the Authorization header when logged in.
 * - Parses JSON responses and throws user-friendly errors when requests fail.
 * - Prevents spreading raw fetch calls across components.
 */

const BACKEND_URL =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
    : "http://localhost:5000";

const API_BASE = `${BACKEND_URL}/api`;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("preply_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  // Attach JWT Bearer token if user is authenticated
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const errorData = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : {};
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("The server returned an unexpected response. Check that the backend is running.");
  }

  return response.json();
}
