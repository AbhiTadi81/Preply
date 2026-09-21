import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ArrowRight, History } from "lucide-react";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import { reportService } from "../../services/reportService";
import { formatDate } from "../../utils/helpers";
export const DailyReport = () => {
  const [report, setReport] = useState(null);
  useEffect(() => {
    reportService.getTodayReport().then(setReport).catch(() => {
    });
  }, []);
  return <div className="py-10 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        {
    /* Header navigation bar */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] bg-[#e8faf1] px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
                Daily AI Analysis
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {report ? formatDate(report.date) : "Today"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Daily Skill Gap Report
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/reports/history">
              <Button variant="secondary" size="md" icon={<History className="w-4 h-4 text-slate-500" />}>
                Report History
              </Button>
            </Link>
            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Practice Weak Topics
              </Button>
            </Link>
          </div>
        </div>

        {
    /* Big Dashboard Card */
  }
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 card-subtle-shadow mb-8">
          {
    /* Top Score & Metrics */
  }
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-100">
            <div className="p-5 rounded-2xl bg-[#e8faf1]/80 border border-[#b7eed4] text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] block mb-1">
                Today's Overall Score
              </span>
              <span className="text-4xl font-extrabold text-[#008f4c]">
                {report?.overallScore || 76}%
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Interviews Completed
              </span>
              <span className="text-4xl font-bold text-slate-900">
                {report?.interviewsCount || 3}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Questions Evaluated
              </span>
              <span className="text-4xl font-bold text-slate-900">
                {report?.questionsCount || 35}
              </span>
            </div>
          </div>

          {
    /* Skill Performance Breakdown */
  }
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Skill Performance Breakdown
            </h3>
            <div className="space-y-4">
              {(report?.skillPerformance || [
    { skill: "JavaScript", score: 82 },
    { skill: "React", score: 68 },
    { skill: "Node.js", score: 61 },
    { skill: "MongoDB", score: 84 },
    { skill: "SQL", score: 91 }
  ]).map((skill) => <div key={skill.skill} className="flex items-center gap-4">
                  <span className="w-28 text-xs sm:text-sm font-semibold text-slate-800 shrink-0">
                    {skill.skill}
                  </span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
    className={`h-full rounded-full ${skill.score >= 80 ? "bg-[#00ba66]" : skill.score >= 65 ? "bg-amber-500" : "bg-rose-500"}`}
    style={{ width: `${skill.score}%` }}
  />
                  </div>
                  <span className="w-12 text-right text-xs sm:text-sm font-bold text-slate-900">
                    {skill.score}%
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* Strong Areas vs Weak Areas */
  }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-[#f7fdfa] border border-emerald-100">
              <div className="flex items-center gap-2 mb-4 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-[#00ba66]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Strong Areas Identified</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
                {(report?.strongAreas || ["SQL queries", "MongoDB concepts", "JavaScript fundamentals"]).map((item, idx) => <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#00ba66] font-bold">✓</span> {item}
                  </li>)}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <div className="flex items-center gap-2 mb-4 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Weak Areas to Target</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
                {(report?.weakAreas || ["React Hooks", "Node.js Middleware", "Async Programming"]).map((item, idx) => <li key={idx} className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">⚠</span> {item}
                  </li>)}
              </ul>
            </div>
          </div>

          {
    /* Repeated Mistakes */
  }
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Repeated Mistakes Across Sessions
            </h4>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Skipping lexical environment explanation when discussing closures in JavaScript</li>
              <li>Neglecting error handling in asynchronous Promise chains and middleware pipelines</li>
            </ul>
          </div>

          {
    /* Recommended Practice Next */
  }
          <div className="p-6 rounded-2xl bg-[#f2fbf6] border border-[#b7eed4]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#008f4c] mb-3">
              Action Plan: Recommended Practice for Tomorrow
            </h4>
            <ol className="text-xs sm:text-sm text-slate-800 space-y-2 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white border border-[#b7eed4] text-[#008f4c] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                React Hooks: useEffect dependency lifecycle & stale closures
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white border border-[#b7eed4] text-[#008f4c] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                Node.js Middleware: Error-first patterns and next() propagation
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white border border-[#b7eed4] text-[#008f4c] text-xs font-bold flex items-center justify-center shrink-0">3</span>
                Promises & Async/Await concurrency handling
              </li>
            </ol>
          </div>
        </div>
      </Container>
    </div>;
};
