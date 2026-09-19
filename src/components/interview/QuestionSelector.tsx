import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuestionSelectorProps {
  selectedCount: number | null;
  onSelectCount: (count: number) => void;
  disabled?: boolean;
}

export const QUESTION_OPTIONS = [5, 10, 15, 20] as const;

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  selectedCount,
  onSelectCount,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-slate-900 block">
          Number of Questions
        </label>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Choose interview depth
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {QUESTION_OPTIONS.map((count) => {
          const isSelected = selectedCount === count;
          return (
            <button
              key={count}
              type="button"
              id={`question-count-${count}`}
              disabled={disabled}
              onClick={() => onSelectCount(count)}
              className={`py-3.5 px-3 rounded-2xl text-center font-bold transition-all border text-base cursor-pointer ${
                isSelected
                  ? 'bg-[#00ba66] text-white border-[#00ba66] shadow-sm ring-2 ring-[#00ba66]/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#00ba66] hover:bg-slate-50/80'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="block text-lg sm:text-xl font-extrabold">{count}</span>
              <span
                className={`block text-[11px] font-medium uppercase tracking-wider mt-0.5 ${
                  isSelected ? 'text-white/90' : 'text-slate-400'
                }`}
              >
                Questions
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
