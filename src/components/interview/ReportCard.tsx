import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Check,
  CircleDot,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { FinalInterviewReport, ResumeCoverageItem } from '../../types';

interface ReportCardProps {
  report: FinalInterviewReport;
  resumeFileName?: string;
  totalQuestions?: number;
}

const defaultResumeCoverageList: ResumeCoverageItem[] = [
  {
    skill: 'System Architecture & Scalability',
    topic: 'System Design',
    status: 'Tested',
    finalFeedback:
      'Strong demonstration of horizontal scaling, caching strategies, and decoupled asynchronous queue design.',
    nextPracticeRecommendation:
      'Practice explaining distributed lock management and read-heavy cache invalidation patterns.',
  },
  {
    skill: 'Database Design & Optimization',
    topic: 'Databases',
    status: 'Tested',
    finalFeedback:
      'Clear articulation of relational indexing strategies, transaction ACID guarantees, and query bottleneck analysis.',
    nextPracticeRecommendation:
      'Review composite B-tree indexing trade-offs and connection pool saturation under peak write load.',
  },
  {
    skill: 'REST APIs & Microservices',
    topic: 'Backend Architecture',
    status: 'Tested',
    finalFeedback:
      'Well-structured explanation of RESTful contracts, error response schemas, and idempotency guarantees.',
    nextPracticeRecommendation:
      'Practice designing idempotent POST operations using distributed Redis locks and unique request tokens.',
  },
  {
    skill: 'Data Pipeline & Concurrency / Async',
    topic: 'Data Engineering',
    status: 'Partially Tested',
    finalFeedback:
      'Addressed asynchronous event loops and data skew conceptually, but did not quantify throughput or backpressure.',
    nextPracticeRecommendation:
      'Implement an asynchronous worker pool with exponential backoff and dead-letter queues.',
  },
  {
    skill: 'Frontend Engineering & State Lifecycle',
    topic: 'Frontend',
    status: 'Partially Tested',
    finalFeedback:
      'Mentioned UI components and client state; depth on browser rendering optimization and bundle profiling remains unverified.',
    nextPracticeRecommendation:
      'Practice explaining virtual DOM diffing, Core Web Vitals optimization, and optimistic UI mutations.',
  },
  {
    skill: 'Testing, CI/CD & Reliability',
    topic: 'DevOps & Quality',
    status: 'Not Tested',
    finalFeedback:
      'Infrastructure automation, container orchestration (Docker/K8s), and deployment rollback pipelines were not evaluated.',
    nextPracticeRecommendation:
      'Review canary deployment strategies, automated integration testing, and blue-green switchovers.',
  },
];

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  resumeFileName = 'Resume.pdf',
  totalQuestions = 5,
}) => {
  const coverageItems: ResumeCoverageItem[] =
    report.resumeCoverage && report.resumeCoverage.length > 0
      ? report.resumeCoverage
      : defaultResumeCoverageList;

  const testedCount = coverageItems.filter((i) => i.status === 'Tested').length;
  const partialCount = coverageItems.filter((i) => i.status === 'Partially Tested').length;
  const untestedCount = coverageItems.filter((i) => i.status === 'Not Tested').length;

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Card with Overall Score */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center mx-auto mb-4 border border-[#b7eed4] shadow-xs">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] bg-[#e8faf1] px-3.5 py-1 rounded-full border border-[#b7eed4]">
          Interview Completed
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
          INTERVIEW REPORT
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
          Based on your resume (<span className="font-semibold text-slate-700">{resumeFileName}</span>) and {totalQuestions} answered questions.
        </p>

        {/* Primary Overall Score Display */}
        <div className="my-8 inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#f7fdfa] border-2 border-[#b7eed4] shadow-xs min-w-[240px]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Overall Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl sm:text-6xl font-black text-[#008f4c] tracking-tight">
              {report.overallScore}
            </span>
            <span className="text-xl font-bold text-slate-400">/ 100</span>
          </div>
        </div>

        {/* 4 Core Competency Scores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-2xl mx-auto text-left">
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Technical Knowledge
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {report.technicalKnowledgeScore}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                / 100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#00ba66] h-full rounded-full"
                style={{ width: `${report.technicalKnowledgeScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Project Knowledge
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {report.projectKnowledgeScore}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                / 100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#00ba66] h-full rounded-full"
                style={{ width: `${report.projectKnowledgeScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Communication
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {report.communicationScore}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                / 100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#00ba66] h-full rounded-full"
                style={{ width: `${report.communicationScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Answer Relevance
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {report.answerRelevanceScore}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                / 100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#00ba66] h-full rounded-full"
                style={{ width: `${report.answerRelevanceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 card-subtle-shadow">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-[#e8faf1] text-[#008f4c] flex items-center justify-center">
              <Check className="w-4 h-4 font-bold" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Strengths:</h3>
          </div>

          <ul className="space-y-3">
            {report.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-[#008f4c] font-extrabold mt-0.5 shrink-0">✓</span>
                <span className="font-medium leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 card-subtle-shadow">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CircleDot className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Areas to Improve:</h3>
          </div>

          <ul className="space-y-3">
            {report.areasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-amber-600 font-extrabold mt-0.5 shrink-0">•</span>
                <span className="font-medium leading-relaxed">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Single Table: Resume Skill & Interview Coverage ONLY */}
      <div
        id="resume-coverage-card"
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 card-subtle-shadow"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="w-5 h-5 text-[#00ba66]" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Resume Skill & Interview Coverage
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Audit of resume skill domains detected and their evaluation status in this interview.
            </p>
          </div>

          {/* Coverage Summary Metrics */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8faf1] border border-[#b7eed4] text-[#008f4c] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{testedCount} Tested</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{partialCount} Partially Tested</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{untestedCount} Not Tested</span>
            </span>
          </div>
        </div>

        {/* Responsive Table with Resume Skill and Interview Coverage ONLY */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-50/80">
                <th className="py-3.5 px-5 rounded-l-xl w-3/5">Resume Skill / Area</th>
                <th className="py-3.5 px-5 rounded-r-xl w-2/5">Interview Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {coverageItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#fbfdfc] transition-colors group"
                >
                  {/* Resume Skill / Area & Topic */}
                  <td className="py-4 px-5 align-middle">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {item.skill}
                      </span>
                      {item.topic && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#008f4c] bg-[#e8faf1] px-2.5 py-0.5 rounded-md border border-[#b7eed4]">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{item.topic}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Interview Coverage Status Badge */}
                  <td className="py-4 px-5 align-middle whitespace-nowrap">
                    {item.status === 'Tested' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8faf1] border border-[#b7eed4] text-[#008f4c] text-xs font-bold shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>✓ Tested</span>
                      </span>
                    )}
                    {item.status === 'Partially Tested' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>⚠ Partially Tested</span>
                      </span>
                    )}
                    {item.status === 'Not Tested' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold shadow-2xs">
                        <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>⚠ Not Tested</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Separate Section: Final AI Feedback */}
      <div
        id="final-ai-feedback-section"
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 card-subtle-shadow space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Final AI Feedback
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Comprehensive interviewer evaluation and qualitative analysis across your answers.
              </p>
            </div>
          </div>
        </div>

        {/* Overall Feedback Paragraph */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Executive Assessment</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
            "{report.overallFeedback}"
          </p>
        </div>

        {/* Detailed Skill-by-Skill AI Feedback */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Skill-by-Skill AI Feedback
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {coverageItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#fbfdfc] p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-2.5 hover:border-[#b7eed4] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.skill}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        item.status === 'Tested'
                          ? 'bg-[#e8faf1] text-[#008f4c] border-[#b7eed4]'
                          : item.status === 'Partially Tested'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.finalFeedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separate Section: Next Practice Recommendation */}
      <div
        id="next-practice-recommendations-section"
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 card-subtle-shadow space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Next Practice Recommendations
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Targeted technical drills, architecture exercises, and core study topics to prepare for upcoming interviews.
              </p>
            </div>
          </div>
        </div>

        {/* Skill-Specific Next Practice Drills */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Skill-Specific Practice Drills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {coverageItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {item.skill}
                  </span>
                  {item.topic && (
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {item.topic}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                  <ArrowRight className="w-4 h-4 text-[#00ba66] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">
                    {item.nextPracticeRecommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Focus Topics Tags */}
        {report.recommendedPractice && report.recommendedPractice.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
              Priority Focus Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.recommendedPractice.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f0fbf5] text-[#008f4c] text-xs font-bold border border-[#b7eed4] shadow-2xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex justify-center pt-2 pb-6">
        <Link to="/interview/setup">
          <button
            type="button"
            id="take-another-interview-btn"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#00ba66] hover:bg-[#00a85b] text-white font-extrabold text-base shadow-lg shadow-[#00ba66]/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Interview</span>
          </button>
        </Link>
      </div>
    </div>
  );
};
