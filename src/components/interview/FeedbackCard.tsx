import React from 'react';
import { ArrowRight, CheckCircle2, Award, Sparkles, AlertCircle } from 'lucide-react';
import { AnswerEvaluation } from '../../types';

interface FeedbackCardProps {
  score: number;
  feedback: string;
  evaluation?: AnswerEvaluation;
  isLastQuestion: boolean;
  onNext: () => void;
  isLoadingNext?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  score,
  feedback,
  evaluation,
  isLastQuestion,
  onNext,
  isLoadingNext = false,
}) => {
  return (
    <div
      id="answer-feedback-card"
      className="bg-white rounded-3xl border-2 border-[#00ba66]/30 p-6 sm:p-8 card-subtle-shadow animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center border border-[#b7eed4]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Answer Feedback
          </h3>
        </div>

        {/* Score pill e.g. 7 / 10 */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e8faf1] border border-[#b7eed4] text-[#008f4c]">
          <Award className="w-4 h-4" />
          <span className="text-sm sm:text-base font-extrabold">{score} / 10</span>
        </div>
      </div>

      {/* Main Feedback sentence */}
      <div className="bg-[#f7fdfa] rounded-2xl p-5 border border-[#c4f3dc] mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] block mb-1">
          AI Evaluation
        </span>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
          "{feedback}"
        </p>
      </div>

      {/* Subscores breakdown if available */}
      {evaluation && (
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Technical
            </span>
            <span className="text-base font-extrabold text-slate-800">
              {evaluation.technicalScore || score}/10
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Clarity
            </span>
            <span className="text-base font-extrabold text-slate-800">
              {evaluation.clarityScore || Math.min(10, score + 1)}/10
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Relevance
            </span>
            <span className="text-base font-extrabold text-slate-800">
              {evaluation.answerRelevanceScore || Math.min(10, score + 1)}/10
            </span>
          </div>
        </div>
      )}

      {/* Next Question / Finish Action */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          id="next-question-btn"
          disabled={isLoadingNext}
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00ba66] hover:bg-[#00a85b] text-white font-bold text-sm shadow-md shadow-[#00ba66]/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>{isLastQuestion ? 'View Final Report' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
