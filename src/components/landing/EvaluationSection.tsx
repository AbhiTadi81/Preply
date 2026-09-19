import React from 'react';
import { Sparkles, Check, AlertCircle, Award } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';

// Evaluation section showing granular feedback on voice answers
export const EvaluationSection: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#fcfdfd] border-t border-slate-100">
      <Container>
        {/* Section Header */}
        <SectionHeader
          badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
          badgeText="Intelligent Feedback"
          title="Every answer becomes an opportunity to improve."
          description="Preply evaluates your answers, identifies missing concepts, and gives you actionable feedback instead of only giving you a score."
        />

        {/* Large dashboard-style visual card */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 card-subtle-shadow">
          {/* Top header bar of the evaluation card */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center font-bold text-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Evaluation Breakdown</h3>
                <p className="text-xs text-slate-500">Topic: JavaScript • Subtopic: Closures & Scope</p>
              </div>
            </div>

            {/* Overall score pill */}
            <div className="flex items-center gap-2 bg-[#e8faf1] border border-[#b7eed4] text-[#008f4c] px-4 py-1.5 rounded-full">
              <span className="text-xs font-semibold uppercase tracking-wider">Overall Score</span>
              <span className="text-base font-extrabold">8 / 10</span>
            </div>
          </div>

          {/* Question & Candidate Voice Answer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Question box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Question
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                Explain closures in JavaScript.
              </p>
            </div>

            {/* Answer transcript box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Your Voice Transcript
              </span>
              <p className="text-sm text-slate-700 italic leading-snug">
                "A closure is when a function remembers variables from its outer scope..."
              </p>
            </div>
          </div>

          {/* Score breakdown metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <p className="text-xs text-slate-500 font-medium mb-1">Technical Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">8</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00ba66] h-full rounded-full w-[80%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <p className="text-xs text-slate-500 font-medium mb-1">Clarity</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">8</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00ba66] h-full rounded-full w-[80%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <p className="text-xs text-slate-500 font-medium mb-1">Completeness</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">7</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[70%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <p className="text-xs text-slate-500 font-medium mb-1">Overall Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#008f4c]">8</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00ba66] h-full rounded-full w-[80%]" />
              </div>
            </div>
          </div>

          {/* Missing Concepts Callout */}
          <div className="mb-6 p-4.5 rounded-2xl border border-amber-200/80 bg-amber-50/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Missing Concepts
              </h4>
              <ul className="text-xs sm:text-sm text-amber-900 font-medium space-y-0.5">
                <li>• Lexical environment & variable lifetime</li>
              </ul>
            </div>
          </div>

          {/* AI Feedback Box */}
          <div className="p-5 rounded-2xl border border-emerald-200/70 bg-[#f7fdfa]">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-[#00ba66]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Actionable AI Feedback
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold">Good explanation.</strong> You correctly explained how a function can access variables from its outer scope. Improve your explanation by explicitly mentioning lexical scope and persistence after execution.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
