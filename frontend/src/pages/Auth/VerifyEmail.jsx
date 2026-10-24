import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Container } from "../../components/common/Container";
import { authService } from "../../services/authService";

const PENDING_KEY = "preply_pending_registration";

function readPending() {
  try {
    const value = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    return value?.challengeId && value?.email ? value : null;
  } catch {
    return null;
  }
}

export const VerifyEmail = () => {
  const [pending, setPending] = useState(readPending);
  const [code, setCode] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(() => {
    const current = readPending();
    return current ? Math.max(0, Math.ceil((new Date(current.resendAvailableAt) - Date.now()) / 1000)) : 0;
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  useEffect(() => {
    if (!pending) navigate("/register", { replace: true });
  }, [navigate, pending]);

  useEffect(() => {
    if (!seconds) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const updatePending = (response) => {
    const next = { ...pending, resendAvailableAt: response.resendAvailableAt };
    localStorage.setItem(PENDING_KEY, JSON.stringify(next));
    setPending(next);
    setSeconds(Math.max(0, Math.ceil((new Date(response.resendAvailableAt) - Date.now()) / 1000)));
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    if (!digits.length) return;
    const next = ["", "", "", ""];
    digits.forEach((digit, index) => { next[index] = digit; });
    setCode(next);
    inputRefs.current[Math.min(digits.length, 4) - 1]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const otp = code.join("");
    if (otp.length !== 4) {
      setError("Enter all four digits.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(pending.challengeId, otp);
      localStorage.removeItem(PENDING_KEY);
      navigate("/interview/setup", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setError("");
    setMessage("");
    setResending(true);
    try {
      updatePending(await authService.resendOtp(pending.challengeId));
      setCode(["", "", "", ""]);
      setMessage("A new code was sent.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err?.response?.resendAvailableAt) updatePending(err.response);
      setError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  if (!pending) return null;
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#fbfdfc]">
    <Container size="sm">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow max-w-md mx-auto text-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block mb-5">
          preply<span className="text-[#00ba66]">.</span>
        </Link>
        <div className="mx-auto mb-5 w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <Mail className="w-5 h-5 text-[#00ba66]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
        <p className="text-sm text-slate-500 mt-2">Enter the four-digit code sent to <strong className="text-slate-700">{pending.email}</strong>.</p>
        {error && <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">{error}</div>}
        {message && <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-7">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => <input
              key={index}
              ref={(element) => { inputRefs.current[index] = element; }}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoFocus={index === 0}
              aria-label={`Verification digit ${index + 1}`}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border border-slate-200 text-center text-xl font-bold text-slate-900 focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15"
            />)}
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full justify-center mt-7" disabled={loading} icon={<ArrowRight className="w-4 h-4" />}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          {seconds > 0 ? `Resend available in ${seconds}s` : "Didn't receive the code?"}
          <button type="button" onClick={handleResend} disabled={seconds > 0 || resending} className="ml-1 text-[#00ba66] font-semibold disabled:text-slate-400 disabled:cursor-not-allowed">
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </Container>
  </div>;
};
