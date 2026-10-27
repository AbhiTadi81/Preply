import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(void 0);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("preply_token");
    if (!savedToken) {
      setIsLoading(false);
      return;
    }
    authService.getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setToken(savedToken);
      })
      .catch(() => authService.logout())
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const theme = user?.preferences?.theme || localStorage.getItem("preply_theme") || "light";
      localStorage.setItem("preply_theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && mediaQuery.matches));
    };
    applyTheme();
    mediaQuery.addEventListener?.("change", applyTheme);
    return () => mediaQuery.removeEventListener?.("change", applyTheme);
  }, [user]);

  const updateUser = (nextUser, nextToken = token) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("preply_user", JSON.stringify(nextUser));
    if (nextToken) localStorage.setItem("preply_token", nextToken);
  };

  const login = async (email, pass) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, pass);
      updateUser(response.user, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = (name, email, pass, role) => authService.register(name, email, pass, role);

  const verifyOtp = async (challengeId, otp) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(challengeId, otp);
      updateUser(response.user, response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return <AuthContext.Provider value={{ user, token, isLoading, login, register, verifyOtp, logout, updateUser }}>
    {children}
  </AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
