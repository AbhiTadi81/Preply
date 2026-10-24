import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Container } from "../../components/common/Container";
import { isValidEmail } from "../../utils/helpers";
import { authService } from "../../services/authService";

const RESET_KEY = "preply_password_reset";

function loadReset() {
  try {
    return JSON.parse(localStorage.getItem(RESET_KEY) || "null");
  } catch {
    return null;
  }
}

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [reset, setReset] = useState(loadReset);
  const [email, setEmail] = useState(loadReset()?.email || "");
  const [code, setCode] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [seconds, setSeconds] = useState(() => {
    const saved = loadReset();
    return saved ? Math.max(0, Math.ceil((new Date(saved.resendAvailableAt) - Date.now()) / 1000)) : 0;
  });
  const [step, setStep] = useState(() => loadReset()?.verified ? "password" : loadReset() ? "otp" : "email");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!seconds) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const saveReset = (value) => {
    localStorage.setItem(RESET_KEY, JSON.stringify(value));
    setReset(value);
    setSeconds(Math.max(0, Math.ceil((new Date(value.resendAvailableAt) - Date.now()) / 1000)));
  };

  const requestReset = async (event) => {
    event.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(email.trim());
      saveReset({ challengeId: response.challengeId, email: response.email, resendAvailableAt: response.resendAvailableAt });
      setStep("otp");
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setError("");
    if (code.join("").length !== 4) {
      setError("Enter all four digits.");
      return;
    }
    setLoading(true);
    try {
      await authService.verifyPasswordResetOtp(reset.challengeId, code.join(""));
      saveReset({ ...reset, verified: true });
      setStep("password");
      setMessage("Email verified. Choose a new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (seconds > 0 || resending) return;
    setError("");
    setResending(true);
    try {
      const response = await authService.resendPasswordResetOtp(reset.challengeId);
      saveReset({ ...reset, resendAvailableAt: response.resendAvailableAt, verified: false });
      setCode(["", "", "", ""]);
      setMessage("A new code was sent.");
      setStep("otp");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend the code.");
    } finally {
      setResending(false);
    }
  };

  const setNewPassword = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(reset.challengeId, password);
      localStorage.removeItem(RESET_KEY);
      navigate("/login", { replace: true, state: { message: "Password updated successfully. Please sign in." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    const next = ["", "", "", ""];
    digits.forEach((digit, index) => { next[index] = digit; });
    setCode(next);
    if (digits.length) inputRefs.current[Math.min(digits.length, 4) - 1]?.focus();
  };

  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#fbfdfc]">
    <Container size="sm">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block mb-3">preply<span className="text-[#00ba66]">.</span></Link>
          <h1 className="text-2xl font-bold text-slate-900">{step === "email" ? "Reset your password" : step === "otp" ? "Verify your email" : "Create a new password"}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{step === "email" ? "We'll send a verification code to your email address." : `Follow the steps to secure your Preply account${email ? ` for ${email}` : ""}.`}</p>
        </div>
        {error && <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">{error}</div>}
        {message && <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">{message}</div>}
        {step === "email" && <form onSubmit={requestReset} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
          <div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input type="email" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 text-slate-900" placeholder="name@domain.com" /></div>
          <Button type="submit" variant="primary" size="md" className="w-full justify-center" disabled={loading} icon={<ArrowRight className="w-4 h-4" />}>{loading ? "Sending..." : "Send Verification Code"}</Button>
        </form>}
        {step === "otp" && <form onSubmit={verifyCode}>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>{code.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} value={digit} onChange={(event) => handleDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus(); }} inputMode="numeric" maxLength={1} autoFocus={index === 0} aria-label={`Verification digit ${index + 1}`} className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border border-slate-200 text-center text-xl font-bold text-slate-900 focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15" />)}</div>
          <Button type="submit" variant="primary" size="md" className="w-full justify-center mt-7" disabled={loading} icon={<ArrowRight className="w-4 h-4" />}>{loading ? "Verifying..." : "Verify Code"}</Button>
          <p className="mt-5 text-center text-sm text-slate-500">{seconds ? `Resend available in ${seconds}s` : "Didn't receive the code?"}<button type="button" onClick={resend} disabled={seconds > 0 || resending} className="ml-1 text-[#00ba66] font-semibold disabled:text-slate-400">{resending ? "Sending..." : "Resend OTP"}</button></p>
        </form>}
        {step === "password" && <form onSubmit={setNewPassword} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">New Password</label>
          <div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input type="password" required autoFocus minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 text-slate-900" placeholder="At least 8 characters" /></div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Confirm Password</label>
          <div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#00ba66] focus:ring-2 focus:ring-[#00ba66]/15 text-slate-900" placeholder="Repeat your password" /></div>
          <Button type="submit" variant="primary" size="md" className="w-full justify-center" disabled={loading} icon={<ArrowRight className="w-4 h-4" />}>{loading ? "Updating..." : "Update Password"}</Button>
        </form>}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center"><Link to="/login" className="text-xs text-[#00ba66] font-semibold hover:underline">Back to sign in</Link></div>
      </div>
    </Container>
  </div>;
};
