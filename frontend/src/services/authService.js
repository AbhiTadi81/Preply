/**
 * Auth Service
 * 
 * Responsibilities:
 * - Communicates with backend /api/auth endpoints (register, login, me).
 * - Manages persisted JWT token and user profile in localStorage.
 */

import { apiFetch } from "./api";

function storeSession(response) {
  localStorage.setItem("preply_token", response.token);
  localStorage.setItem("preply_user", JSON.stringify(response.user));
  return response;
}

export const authService = {
  async register(name, email, password, targetRole) {
    return storeSession(await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, targetRole })
    }));
  },

  async login(email, password) {
    return storeSession(await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }));
  },

  async getCurrentUser() {
    const response = await apiFetch("/auth/me");
    localStorage.setItem("preply_user", JSON.stringify(response.user));
    return response.user;
  },

  logout() {
    localStorage.removeItem("preply_token");
    localStorage.removeItem("preply_user");
  }
};
