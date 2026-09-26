/**
 * Application Routes
 * 
 * Responsibilities:
 * - Maps URL paths to React page components.
 * - Protects authenticated routes (Dashboard, Interview, Reports, Profile) via ProtectedRoute.
 * - Public routes: Home (/), Login (/login), Register (/register).
 */

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { InterviewSetup } from "../pages/Interview/InterviewSetup";
import { Interview } from "../pages/Interview/Interview";
import { InterviewResult } from "../pages/Interview/InterviewResult";
import { DailyReport } from "../pages/Reports/DailyReport";
import { ReportHistory } from "../pages/Reports/ReportHistory";
import { Profile } from "../pages/Profile/Profile";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export const AppRoutes = () => {
  return <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
      <Route path="/interview/:id" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
      <Route path="/interview/report" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
      <Route path="/interview/:id/report" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
      <Route path="/interview/:id/result" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
      <Route path="/reports/history" element={<ProtectedRoute><ReportHistory /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
};
