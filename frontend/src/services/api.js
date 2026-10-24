/**
 * Centralized API Fetch Utility.
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

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.response = data || {};
    throw error;
  }

  if (!contentType.includes("application/json")) {
    throw new Error("The server returned an unexpected response. Check that the backend is running.");
  }

  return data;
}
