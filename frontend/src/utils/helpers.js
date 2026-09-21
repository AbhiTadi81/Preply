export function formatScore(score) {
  return `${Math.round(score)}%`;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function getScoreColor(score) {
  if (score >= 80) {
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    };
  }
  if (score >= 65) {
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200"
    };
  }
  return {
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200"
  };
}
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
