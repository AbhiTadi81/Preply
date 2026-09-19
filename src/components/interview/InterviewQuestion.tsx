import React from 'react';
import { Sparkles, Bot, Volume2 } from 'lucide-react';
import { Question } from '../../types';

interface InterviewQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
}) => {
  const handleSpeakQuestion = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.question);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      id="interview-question-card"
      className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 card-subtle-shadow transition-all"
    >
      {/* Header with question count badge and topic */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center border border-[#b7eed4] shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-wide flex items-center gap-1.5">
              AI Interviewer
              <Sparkles className="w-3.5 h-3.5 text-[#00ba66]" />
            </span>
            <span className="text-[11px] text-slate-400 block">
              Personalized from your resume & projects
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {question.topic && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/70">
              {question.topic}
            </span>
          )}
          <span className="text-xs font-bold text-[#008f4c] bg-[#e8faf1] px-3 py-1 rounded-full border border-[#b7eed4]">
            Question {questionNumber} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="relative">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight mb-4">
          "{question.question}"
        </h2>

        {/* Audio listen helper button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeakQuestion}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#008f4c] bg-slate-50 hover:bg-[#f0fbf5] border border-slate-200 hover:border-[#b7eed4] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="Listen to question"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read aloud</span>
          </button>

          {question.subtopic && (
            <span className="text-[11px] text-slate-400 font-medium italic">
              Context: {question.subtopic}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
