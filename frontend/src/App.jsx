/**
 * Root Application Component
 * 
 * Responsibilities:
 * - Provides client-side routing via React Router (BrowserRouter).
 * - Wraps the component tree with AuthProvider for global authentication state.
 * - Renders consistent layout structure: Navbar, page content via AppRoutes, and Footer.
 */

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
          {/* Main responsive navbar */}
          <Navbar />

          {/* Dynamic page routes based on current URL path */}
          <main className="flex-1">
            <AppRoutes />
          </main>

          {/* Global footer */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
