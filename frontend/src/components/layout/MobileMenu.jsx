import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, ChevronRight, Play, LogIn, LogOut, Home, Sparkles, Layers, MessageSquare, Mail } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import { Button } from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
const getLinkIcon = (name) => {
  switch (name.toLowerCase()) {
    case "home":
      return <Home className="w-4 h-4 text-slate-400" />;
    case "features":
      return <Sparkles className="w-4 h-4 text-[#00ba66]" />;
    case "how it works":
      return <Layers className="w-4 h-4 text-emerald-600" />;
    case "testimonials":
      return <MessageSquare className="w-4 h-4 text-slate-400" />;
    case "contact":
      return <Mail className="w-4 h-4 text-slate-400" />;
    default:
      return <ChevronRight className="w-4 h-4 text-slate-400" />;
  }
};
export const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const content = <div className="fixed inset-0 z-[100] lg:hidden">
      {
    /* 1. Shaded Backdrop Overlay */
  }
      <div
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
    onClick={onClose}
    aria-hidden="true"
  />

      {
    /* 2. Solid Opaque Slide-out Drawer with 100% white background */
  }
      <div
    className="fixed right-0 top-0 bottom-0 w-[88vw] max-w-sm z-[101] flex flex-col justify-between shadow-2xl border-l border-slate-200 transition-transform duration-300 ease-out"
    style={{ backgroundColor: "#ffffff" }}
  >
        {
    /* Top Header */
  }
        <div className="p-5 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: "#ffffff" }}>
          <Link to="/" onClick={onClose} className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
            preply<span className="text-[#00ba66] text-2xl leading-none">.</span>
          </Link>
          <button
    type="button"
    onClick={onClose}
    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/60"
    aria-label="Close navigation menu"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Navigation Items in a shaded, well-spaced list */
  }
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation Menu
          </div>

          <nav className="space-y-1.5">
            {NAV_LINKS.map((link) => <a
    key={link.name}
    href={link.href}
    onClick={onClose}
    className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:text-[#008f4c] hover:bg-[#e8faf1] transition-all group border border-transparent hover:border-[#b7eed4]"
  >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white transition-colors border border-slate-100 group-hover:border-[#b7eed4]">
                    {getLinkIcon(link.name)}
                  </span>
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00ba66] transition-colors" />
              </a>)}
          </nav>

          {
    /* Quick info card inside menu */
  }
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-slate-800 mb-1">
              Voice Interview Practice
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Practice real-time technical questions with speech recognition and instant daily AI analysis.
            </p>
          </div>
        </div>

        {
    /* Bottom Actions with high contrast */
  }
        <div className="p-5 border-t border-slate-100 space-y-2.5" style={{ backgroundColor: "#ffffff" }}>
          <Link to="/interview/setup" onClick={onClose} className="block w-full">
            <Button
    variant="primary"
    size="md"
    className="w-full justify-center shadow-xs"
    icon={<Play className="w-4 h-4 fill-white" />}
  >
              Start Practicing
            </Button>
          </Link>

          {user ? <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                {(() => {
    const displayName = user.name && user.name !== "Candidate Demo" ? user.name : user.email ? user.email.split("@")[0] : "Candidate";
    return <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#00ba66] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {displayName[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800 truncate">
                        {displayName}
                      </span>
                    </div>;
  })()}
                <span className="text-[10px] text-[#008f4c] font-bold bg-[#e8faf1] px-2 py-0.5 rounded-full border border-[#b7eed4] shrink-0">
                  Logged In
                </span>
              </div>

              <button
    type="button"
    id="mobile-logout-btn"
    onClick={() => {
      logout();
      onClose();
    }}
    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
  >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div> : <Link to="/login" onClick={onClose} className="block w-full">
              <Button
    variant="secondary"
    size="md"
    className="w-full justify-center"
    icon={<LogIn className="w-4 h-4 text-slate-500" />}
  >
                Sign In
              </Button>
            </Link>}
        </div>
      </div>
    </div>;
  return createPortal(content, document.body);
};
