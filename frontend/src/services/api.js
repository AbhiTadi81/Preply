/**
 * Centralized API Fetch Utility.
 */

const configuredBackendUrl =
  typeof process !== "undefined" && process.env
    ? process.env.REACT_APP_API_URL
    : undefined;
const isProduction = typeof process !== "undefined"
  && process.env
  && process.env.NODE_ENV === "production";

function resolveBackendUrl() {
  if (!configuredBackendUrl) {
    if (isProduction) {
      throw new Error("REACT_APP_API_URL is required for the production frontend build.");
    }
    const localHost = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
    return `http://${localHost}:5000`;
  }

  let parsed;
  try {
    parsed = new URL(configuredBackendUrl);
  } catch {
    throw new Error("REACT_APP_API_URL must be a valid absolute HTTP(S) URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("REACT_APP_API_URL must use HTTP or HTTPS.");
  }
  if (isProduction && (parsed.protocol !== "https:" || /^(localhost|127\.0\.0\.1)$/i.test(parsed.hostname))) {
    throw new Error("REACT_APP_API_URL must be a public HTTPS URL in production.");
  }

  return `${parsed.origin}${parsed.pathname.replace(/\/api\/?$/, "").replace(/\/$/, "")}`;
}

const API_BASE = `${resolveBackendUrl()}/api`;

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
    error.status = response.status;
    throw error;
  }

  if (!contentType.includes("application/json")) {
    throw new Error("The server returned an unexpected response. Check that the backend is running.");
  }

  return data;
}
