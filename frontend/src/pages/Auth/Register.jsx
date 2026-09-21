import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Container } from "../../components/common/Container";
import { TARGET_ROLES } from "../../utils/constants";
import { isValidEmail } from "../../utils/helpers";
export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0].title);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email.trim(), password, targetRole);
      navigate("/interview/setup", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed.");
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#fbfdfc]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow max-w-md mx-auto">
          {
    /* Header */
  }
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block mb-3">
              preply<span className="text-[#00ba66]">.</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start your voice interview training and daily skill tracking
            </p>
          </div>

          {error && <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 transition-all text-slate-900"
    placeholder="John Doe"
  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="email"
    required
    inputMode="email"
    autoComplete="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      if (error) setError("");
    }}
    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 transition-all text-slate-900"
    placeholder="name@domain.com"
  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-10 pr-12 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 transition-all text-slate-900"
    placeholder="••••••••"
  />
                <button
    type="button"
    onClick={() => setShowPassword((visible) => !visible)}
    aria-label={showPassword ? "Hide password" : "Show password"}
    title={showPassword ? "Hide password" : "Show password"}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
  >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
    value={targetRole}
    onChange={(e) => setTargetRole(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 transition-all text-slate-900"
  >
                  {TARGET_ROLES.map((r) => <option key={r.id} value={r.title}>
                      {r.title}
                    </option>)}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
    type="submit"
    variant="primary"
    size="md"
    className="w-full justify-center"
    disabled={loading}
    icon={<ArrowRight className="w-4 h-4" />}
  >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#00ba66] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>;
};
