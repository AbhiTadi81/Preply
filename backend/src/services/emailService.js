import { ENV } from "../config/env.js";

async function sendOtpEmail(email, otp, subject, validityMinutes) {
  if (!ENV.BREVO_API_KEY || !ENV.BREVO_FROM_EMAIL) {
    const error = new Error("Email verification is not configured. Set BREVO_API_KEY and BREVO_FROM_EMAIL.");
    error.status = 503;
    throw error;
  }

  let response;
  let responseBody = {};
  try {
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": ENV.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Preply",
          email: ENV.BREVO_FROM_EMAIL
        },
        to: [{ email }],
        subject,
        textContent: `Your Preply verification code is ${otp}. It expires in ${validityMinutes} minutes and can only be used once.`
      }),
      signal: AbortSignal.timeout(15000)
    });
    responseBody = await response.json().catch(() => ({}));
  } catch (cause) {
    const error = new Error("The email provider could not be reached.");
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    console.error("[Email] Brevo rejected message:", {
      status: response.status,
      code: responseBody.code,
      message: responseBody.message
    });
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
