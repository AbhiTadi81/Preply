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
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, targetRole })
    });
  },

  async verifyOtp(challengeId, otp) {
    return storeSession(await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ challengeId, otp })
    }));
  },

  async resendOtp(challengeId) {
    return apiFetch("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ challengeId })
    });
  },

  async requestPasswordReset(email) {
    return apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  },

  async resendPasswordResetOtp(challengeId) {
    return apiFetch("/auth/forgot-password/resend-otp", {
      method: "POST",
      body: JSON.stringify({ challengeId })
    });
  },

  async verifyPasswordResetOtp(challengeId, otp) {
    return apiFetch("/auth/forgot-password/verify-otp", {
      method: "POST",
      body: JSON.stringify({ challengeId, otp })
    });
  },

  async resetPassword(challengeId, password) {
    return apiFetch("/auth/forgot-password/reset", {
      method: "POST",
      body: JSON.stringify({ challengeId, password })
    });
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
  async updateProfile(changes) {
    return storeSession({ ...await apiFetch("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(changes)
    }), token: localStorage.getItem("preply_token") });
  },
  async changePassword(values) {
    return storeSession(await apiFetch("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(values)
    }));
  },

  logout() {
    localStorage.removeItem("preply_token");
    localStorage.removeItem("preply_user");
  }
};
