import { apiFetch } from './api';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string, targetRole?: string): Promise<AuthResponse> {
    try {
      return await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, targetRole }),
      });
    } catch {
      // Fallback local persistence if backend is offline
      const mockUser: User = {
        id: 'usr_' + Date.now(),
        name,
        email,
        targetRole: targetRole || 'Frontend Developer',
        createdAt: new Date().toISOString(),
      };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('preply_user', JSON.stringify(mockUser));
      localStorage.setItem('preply_token', token);
      return { user: mockUser, token };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.user && (res.user.name === 'Candidate Demo' || !res.user.name)) {
        res.user.name = res.user.email
          ? res.user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Candidate';
      }
      localStorage.setItem('preply_token', res.token);
      localStorage.setItem('preply_user', JSON.stringify(res.user));
      return res;
    } catch {
      // Fallback local persistence
      const savedUser = localStorage.getItem('preply_user');
      let user: User = savedUser
        ? JSON.parse(savedUser)
        : {
            id: 'usr_guest',
            name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Candidate',
            email,
            targetRole: 'Frontend Developer',
            createdAt: new Date().toISOString(),
          };
      if (user.name === 'Candidate Demo' || !user.name) {
        user.name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Candidate';
      }
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('preply_token', token);
      localStorage.setItem('preply_user', JSON.stringify(user));
      return { user, token };
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('preply_user');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw) as User;
      if (user.name === 'Candidate Demo' || !user.name) {
        user.name = user.email ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Candidate';
        localStorage.setItem('preply_user', JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('preply_token');
    localStorage.removeItem('preply_user');
  },
};
