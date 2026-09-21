import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import { Button } from "../common/Button";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "../../hooks/useAuth";
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  return <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {
    /* Left: Logo with green dot */
  }
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
            preply<span className="text-[#00ba66] text-3xl leading-none">.</span>
          </Link>
        </div>

        {
    /* Center: Desktop Navigation Links */
  }
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => <a
    key={link.name}
    href={link.href}
    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
  >
              {link.name}
            </a>)}
        </nav>

        {
    /* Right: Desktop Action Buttons */
  }
        <div className="hidden md:flex items-center gap-3">
          <Link to="/interview/setup">
            <Button variant="primary" size="md">
              Start Practicing
            </Button>
          </Link>

          {user ? <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div
    id="user-profile-badge"
    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700"
    title={user.email}
  >
                {(() => {
    const displayName = user.name && user.name !== "Candidate Demo" ? user.name : user.email ? user.email.split("@")[0] : "Candidate";
    return <>
                      <div className="w-5 h-5 rounded-full bg-[#00ba66] text-white flex items-center justify-center text-[10px] font-bold">
                        {displayName[0].toUpperCase()}
                      </div>
                      <span className="max-w-[130px] truncate">{displayName}</span>
                    </>;
  })()}
              </div>

              <button
    type="button"
    id="navbar-logout-btn"
    onClick={logout}
    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
    title="Log out"
  >
                <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                <span>Log out</span>
              </button>
            </div> : <Link to="/login" id="navbar-login-link">
              <Button variant="secondary" size="md">
                Login
              </Button>
            </Link>}
        </div>

        {
    /* Mobile menu trigger */
  }
        <div className="flex md:hidden items-center gap-2">
          <Link to="/interview/setup">
            <Button variant="primary" size="sm">
              Practice
            </Button>
          </Link>
          <button
    type="button"
    onClick={() => setMobileMenuOpen(true)}
    className="p-2.5 text-slate-700 hover:text-slate-950 bg-slate-100/90 hover:bg-slate-200/90 rounded-xl border border-slate-200/80 transition-all cursor-pointer shadow-xs"
    aria-label="Open menu"
  >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileMenu
    isOpen={mobileMenuOpen}
    onClose={() => setMobileMenuOpen(false)}
  />
    </header>;
};
