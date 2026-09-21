export const ProgressBar = ({
  currentQuestion,
  totalQuestions
}) => {
  const safeTotal = Math.max(1, totalQuestions);
  const safeCurrent = Math.min(safeTotal, Math.max(1, currentQuestion));
  const percentage = Math.round(safeCurrent / safeTotal * 100);
  return <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interview Progress
          </span>
          <span className="text-xs font-extrabold text-[#008f4c] bg-[#e8faf1] px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
            Question {safeCurrent} / {safeTotal}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {percentage}% Completed
        </span>
      </div>

      {
    /* Progress Dots: "Progress: ● ● ● ○ ○ ○ ○ ○ ○ ○" */
  }
      <div className="flex items-center gap-1.5 flex-wrap my-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Progress:</span>
        {Array.from({ length: safeTotal }).map((_, index) => {
    const qNum = index + 1;
    const isCompleted = qNum < safeCurrent;
    const isCurrent = qNum === safeCurrent;
    return <span
      key={index}
      title={`Question ${qNum} of ${safeTotal}`}
      className={`inline-block transition-all ${isCompleted ? "text-[#00ba66] text-base leading-none font-bold" : isCurrent ? "text-emerald-500 text-base leading-none animate-pulse font-extrabold" : "text-slate-300 text-base leading-none"}`}
    >
              {isCompleted || isCurrent ? "\u25CF" : "\u25CB"}
            </span>;
  })}
      </div>

      {
    /* Linear Track bar */
  }
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1.5">
        <div
    className="bg-[#00ba66] h-full rounded-full transition-all duration-300 ease-out"
    style={{ width: `${percentage}%` }}
  />
      </div>
    </div>;
};
