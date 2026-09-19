import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { InterviewSetup } from '../pages/Interview/InterviewSetup';
import { Interview } from '../pages/Interview/Interview';
import { InterviewResult } from '../pages/Interview/InterviewResult';
import { DailyReport } from '../pages/Reports/DailyReport';
import { ReportHistory } from '../pages/Reports/ReportHistory';
import { Profile } from '../pages/Profile/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview/setup" element={<InterviewSetup />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/interview/:id" element={<Interview />} />
      <Route path="/interview/report" element={<InterviewResult />} />
      <Route path="/interview/:id/report" element={<InterviewResult />} />
      <Route path="/interview/:id/result" element={<InterviewResult />} />
      <Route path="/reports" element={<DailyReport />} />
      <Route path="/reports/history" element={<ReportHistory />} />
      <Route path="/reports/:id" element={<DailyReport />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
