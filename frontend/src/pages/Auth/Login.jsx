import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Container } from "../../components/common/Container";
import { isValidEmail } from "../../utils/helpers";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || "/interview/setup", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#fbfdfc]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow max-w-md mx-auto">
          {
    /* Header */
  }
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block mb-3">
              preply<span className="text-[#00ba66]">.</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in to continue your voice interview practice
            </p>
          </div>

          {error && <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#00ba66] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
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

            <div className="pt-2">
              <Button
    type="submit"
    variant="primary"
    size="md"
    className="w-full justify-center"
    disabled={loading}
    icon={<ArrowRight className="w-4 h-4" />}
  >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#00ba66] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>;
};
