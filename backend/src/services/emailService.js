import { ENV } from "../config/env.js";

async function sendOtpEmail(email, otp, subject, validityMinutes) {
  if (!ENV.RESEND_API_KEY || !ENV.RESEND_FROM_EMAIL) {
    if (ENV.LOCAL_OTP_FALLBACK) {
      console.warn(`[Email] Local OTP for ${email}: ${otp}`);
      return { delivered: false, localOtp: otp };
    }
    const error = new Error("Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
    error.status = 503;
    throw error;
  }

  let response;
  let responseBody = {};
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: ENV.RESEND_FROM_EMAIL,
        to: [email],
        subject,
        text: `Your Preply verification code is ${otp}. It expires in ${validityMinutes} minutes and can only be used once.`
      }),
      signal: AbortSignal.timeout(15000)
    });
    responseBody = await response.json().catch(() => ({}));
  } catch (cause) {
    if (ENV.LOCAL_OTP_FALLBACK) {
      console.warn(`[Email] Resend unavailable; local OTP for ${email}: ${otp}`);
      return { delivered: false, localOtp: otp };
    }
    const error = new Error("The email provider could not be reached.");
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    console.error("[Email] Resend rejected message:", {
      status: response.status,
      name: responseBody.name,
      message: responseBody.message
    });
    if (ENV.LOCAL_OTP_FALLBACK) {
      console.warn(`[Email] Resend rejected message; local OTP for ${email}: ${otp}`);
      return { delivered: false, localOtp: otp };
    }
    const error = new Error("We could not send the verification email. Please try again.");
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }

  return { delivered: true };
}

export function sendSignupOtp(email, otp) {
  return sendOtpEmail(email, otp, "Your Preply verification code", 10);
}

export function sendPasswordResetOtp(email, otp) {
  return sendOtpEmail(email, otp, "Reset your Preply password", 5);
}
