import React from 'react';
import { BarChart3, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';

// Daily AI Report section: The core differentiator showing persistent skill aggregation
export const DailyReportSection: React.FC = () => {
  const skills = [
    { name: 'JavaScript', score: 82, color: 'bg-[#00ba66]' },
    { name: 'React', score: 68, color: 'bg-amber-500' },
    { name: 'Node.js', score: 61, color: 'bg-amber-500' },
    { name: 'MongoDB', score: 84, color: 'bg-[#00ba66]' },
    { name: 'SQL', score: 91, color: 'bg-[#00ba66]' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <Container>
        {/* Section Header */}
        <SectionHeader
          badgeIcon={<BarChart3 className="w-3.5 h-3.5" />}
          badgeText="Total Interview Report"
          title="Know exactly what to improve."
          description="Every interview contributes to your skill profile. Preply analyzes your performance and shows your strongest skills, weakest topics, repeated mistakes, and what to practice next."
        />

        {/* Large dashboard mockup container matching reference design */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 card-subtle-shadow">
          {/* Header of Total Interview Report */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#008f4c] bg-[#e8faf1] px-3 py-1 rounded-full border border-[#b7eed4]">
                  Total Interview Report
                </span>
                <span className="text-xs text-slate-400 font-medium">Auto-generated</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Comprehensive Skill Audit</h3>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Interviews</p>
                <p className="text-lg font-bold text-slate-900">1</p>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Questions</p>
                <p className="text-lg font-bold text-slate-900">35</p>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[#e8faf1] border border-[#b7eed4] text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#008f4c]">Total Score</p>
                <p className="text-lg font-extrabold text-[#008f4c]">76%</p>
              </div>
            </div>
          </div>

          {/* Skill Performance Bars */}
          <div className="my-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Skill Performance Breakdown
            </h4>
            <div className="space-y-3.5">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <span className="w-24 text-xs sm:text-sm font-semibold text-slate-800 shrink-0">
                    {skill.name}
                  </span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs sm:text-sm font-bold text-slate-900">
                    {skill.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Areas, Weak Areas, and Recommended Practice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-100">
            {/* Strong Areas */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-[#00ba66]" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Strong Areas</h5>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-[#00ba66] font-bold">✓</span> SQL queries
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ba66] font-bold">✓</span> MongoDB concepts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ba66] font-bold">✓</span> JavaScript fundamentals
                </li>
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Weak Areas</h5>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">⚠</span> React Hooks
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">⚠</span> Node.js Middleware
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">⚠</span> Async Programming
                </li>
              </ul>
            </div>

            {/* Recommended Practice */}
            <div className="p-5 rounded-2xl bg-[#f5fdf8] border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Recommended Practice
                </h5>
                <ArrowUpRight className="w-4 h-4 text-[#00ba66]" />
              </div>
              <ol className="text-xs sm:text-sm text-slate-800 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  React Hooks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  Node.js Middleware
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  Promises & Async/Await
                </li>
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
