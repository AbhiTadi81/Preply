import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const savedToken = localStorage.getItem("preply_token");
    if (savedToken) {
      authService.getCurrentUser()
        .then((currentUser) => {
          setUser(currentUser);
          setToken(savedToken);
        })
        .catch(() => authService.logout())
        .finally(() => setIsLoading(false));
      return;
    }
    setIsLoading(false);
  }, []);
  const login = async (email, pass) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (name, email, pass, role) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, pass, role);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };
  return <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>;
};
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
