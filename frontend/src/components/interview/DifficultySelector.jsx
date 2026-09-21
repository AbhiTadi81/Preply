import { Sparkles, Zap, Flame, HelpCircle } from "lucide-react";
export const DIFFICULTY_OPTIONS = [
  {
    value: "Easy",
    label: "Easy",
    tag: "Foundational",
    description: "Core concepts, fundamentals & syntax",
    icon: Sparkles
  },
  {
    value: "Medium",
    label: "Medium",
    tag: "Recommended",
    description: "Practical problem solving & trade-offs",
    icon: Zap
  },
  {
    value: "Hard",
    label: "Hard",
    tag: "Advanced",
    description: "Complex system architecture & edge cases",
    icon: Flame
  }
];
export const DifficultySelector = ({
  selectedDifficulty,
  onSelectDifficulty,
  disabled = false
}) => {
  return <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-slate-900 block">
          Interview Difficulty
        </label>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Choose challenge level
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DIFFICULTY_OPTIONS.map((option) => {
    const isSelected = selectedDifficulty === option.value;
    const Icon = option.icon;
    return <button
      key={option.value}
      type="button"
      id={`difficulty-${option.value.toLowerCase()}`}
      disabled={disabled}
      onClick={() => onSelectDifficulty(option.value)}
      className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative flex flex-col justify-between gap-2.5 ${isSelected ? "bg-[#00ba66] text-white border-[#00ba66] shadow-md ring-2 ring-[#00ba66]/20" : "bg-white text-slate-700 border-slate-200 hover:border-[#00ba66] hover:bg-slate-50/80"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : option.value === "Easy" ? "bg-[#e8faf1] text-[#008f4c]" : option.value === "Medium" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}
    >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-base font-extrabold tracking-tight">
                    {option.label}
                  </span>
                </div>

                <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isSelected ? "bg-white/20 text-white" : isSelected ? "bg-white text-slate-900" : "bg-slate-100 text-slate-600"}`}
    >
                  {option.tag}
                </span>
              </div>

              <p
      className={`text-xs leading-relaxed ${isSelected ? "text-white/90 font-medium" : "text-slate-500"}`}
    >
                {option.description}
              </p>
            </button>;
  })}
      </div>
    </div>;
};
