import { Link } from "react-router-dom";
import { Globe, Linkedin, Twitter, Youtube } from "lucide-react";
import { Container } from "../common/Container";
export const Footer = () => {
  return <footer className="relative w-full border-t border-slate-100 bg-white pt-20 pb-16 overflow-hidden">
      {
    /* Soft green ambient gradient glow matching Screenshot 5 */
  }
      <div className="absolute inset-0 pointer-events-none footer-glow opacity-80" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-100/90">
          {
    /* Brand Logo column */
  }
          <div className="md:col-span-3">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block">
              preply<span className="text-[#00ba66] text-3xl leading-none">.</span>
            </Link>
          </div>

          {
    /* Product Links */
  }
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/interview/setup" className="text-sm text-[#00ba66] font-medium hover:underline">
                  Start Practicing
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Resources Links */
  }
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#resources" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Interview Guide
                </a>
              </li>
              <li>
                <a href="#questions" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Practice Questions
                </a>
              </li>
              <li>
                <a href="#skills" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Skill Topics
                </a>
              </li>
              <li>
                <a href="#help" className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
                  Help Center
                  <span className="text-[10px] bg-[#e8faf1] text-[#008f4c] font-semibold px-2 py-0.5 rounded-full border border-[#b7eed4]">
                    New
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {
    /* Legal Links */
  }
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {
    /* Right Side statement from Screenshot 5 */
  }
          <div className="md:col-span-3 flex flex-col justify-between">
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Practice smarter. <br />
              Speak confidently. <br />
              Be ready for the real interview.
            </p>

            {
    /* Social icons */
  }
            <div className="flex items-center gap-4 mt-6 text-slate-500">
              <a href="#globe" className="hover:text-slate-800 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="hover:text-slate-800 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#twitter" className="hover:text-slate-800 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" className="hover:text-slate-800 transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {
    /* Bottom copyright */
  }
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Preply — AI Interview Practice Platform. All rights reserved.</p>
          <p className="text-slate-400">Designed with modern visual typography and voice intelligence.</p>
        </div>
      </Container>
    </footer>;
};
