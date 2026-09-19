// Helper utilities for formatting and score calculations

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): { text: string; bg: string; border: string } {
  if (score >= 80) {
    return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    };
  }
  if (score >= 65) {
    return {
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  }
  return {
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
