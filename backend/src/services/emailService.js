
import { ENV } from "../config/env.js";

function canUseLocalFallback() {
  return (
    ENV.NODE_ENV !== "production" &&
    ENV.LOCAL_OTP_FALLBACK === true
  );
}

function localFallback(otp, reason) {
  if (!canUseLocalFallback()) {
    return null;
  }

  // Development only: never expose OTPs in production logs.
  console.warn(
    `[Email] Mailjet unavailable; local OTP fallback enabled (${reason}): ${otp}`
  );

  return {
    accepted: false,
    delivered: false,
    localOtp: otp
  };
}

function createMailjetError(message, status = 502) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getProviderErrors(responseBody) {
  const message = responseBody?.Messages?.[0];

  if (Array.isArray(message?.Errors)) {
    return message.Errors.map((error) => ({
      errorCode: error.ErrorCode ?? "unknown",
      errorMessage:
        error.ErrorMessage ?? "Unknown provider error",
      errorRelatedTo: error.ErrorRelatedTo ?? undefined
    }));
  }

  if (responseBody?.ErrorMessage || responseBody?.ErrorInfo) {
    return [
      {
        errorCode: responseBody.ErrorIdentifier ?? "unknown",
        errorMessage:
          responseBody.ErrorMessage ??
          responseBody.ErrorInfo
      }
    ];
  }

  return [];
}

async function sendOtpEmail(email, otp, subject, validityMinutes) {
  const requiredConfig = {
    MAILJET_API_KEY: ENV.MAILJET_API_KEY,
    MAILJET_API_SECRET: ENV.MAILJET_API_SECRET,
    MAILJET_FROM_EMAIL: ENV.MAILJET_FROM_EMAIL,
    MAILJET_FROM_NAME: ENV.MAILJET_FROM_NAME
  };

  const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value || !String(value).trim())
    .map(([name]) => name);

  if (missingConfig.length > 0) {
    console.error("[Email] Missing Mailjet configuration:", {
      missing: missingConfig
    });

    const fallback = localFallback(otp, "configuration");
    if (fallback) return fallback;

    throw createMailjetError(
      "Email verification is not configured. Please contact support.",
      503
    );
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw createMailjetError("Please provide a valid email address.", 400);
  }

  let response;
  let responseBody;

  try {
    const authorization = Buffer
      .from(
        `${ENV.MAILJET_API_KEY}:${ENV.MAILJET_API_SECRET}`
      )
      .toString("base64");

    response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: ENV.MAILJET_FROM_EMAIL,
              Name: ENV.MAILJET_FROM_NAME
            },
            To: [
              {
                Email: email.trim()
              }
            ],
            Subject: subject,
            TextPart:
              `Your Preply verification code is ${otp}. ` +
              `It expires in ${validityMinutes} minutes ` +
              "and can only be used once.",
            HTMLPart: `
              <!doctype html>
              <html lang="en">
                <body style="margin:0;padding:24px;font-family:Arial,sans-serif;color:#222;">
                  <div style="max-width:480px;margin:auto;">
                    <h2>Preply verification</h2>
                    <p>Use this code to continue:</p>
                    <p style="font-size:30px;font-weight:bold;letter-spacing:6px;">
                      ${escapeHtml(otp)}
                    </p>
                    <p>This code expires in ${validityMinutes} minutes and can only be used once.</p>
                    <p>If you did not request this code, you can ignore this email.</p>
                  </div>
                </body>
              </html>
            `
          }
        ]
      }),
      signal: AbortSignal.timeout(15000)
    });

    responseBody = await response.json().catch(() => null);
  } catch (cause) {
    console.error("[Email] Mailjet request failed:", {
      name: cause?.name ?? "Error",
      message: cause?.message ?? "Unknown network error"
    });

    const fallback = localFallback(otp, "request failure");
    if (fallback) return fallback;

    throw createMailjetError(
      "The email provider could not be reached. Please try again."
    );
  }

  const message = responseBody?.Messages?.[0];

  // Mailjet may return HTTP 200 while reporting a message-level error.
  if (!response.ok || message?.Status !== "success") {
    console.error("[Email] Mailjet rejected message:", {
      httpStatus: response.status,
      messageStatus: message?.Status ?? "missing",
      errors: getProviderErrors(responseBody)
    });

    const fallback = localFallback(
      otp,
      !response.ok ? "HTTP rejection" : "message rejection"
    );
    if (fallback) return fallback;

    throw createMailjetError(
      "We could not send the verification email. Please try again.",
      response.status === 429 ? 429 : 502
    );
  }

  console.info("[Email] Mailjet accepted OTP email:", {
    httpStatus: response.status,
    messageStatus: message.Status,
    messageId: message.To?.[0]?.MessageID ?? undefined
  });

  // "accepted" means Mailjet accepted the request, not confirmed delivery.
  return {
    accepted: true,
    delivered: false,
    messageId: message.To?.[0]?.MessageID ?? null
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

export function sendSignupOtp(email, otp) {
  return sendOtpEmail(
    email,
    otp,
    "Your Preply verification code",
    10
  );
}

export function sendPasswordResetOtp(email, otp) {
  return sendOtpEmail(
    email,
    otp,
    "Reset your Preply password",
    5
  );
}
