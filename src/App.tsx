import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
          {/* Main responsive navbar */}
          <Navbar />

          {/* Page Routing */}
          <div className="flex-1">
            <AppRoutes />
          </div>

          {/* Footer with green gradient ambiance */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
