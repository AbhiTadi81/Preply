import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart3, Clock, CheckCircle2, ArrowUpRight, Flame, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { interviewService } from '../../services/interviewService';
import { reportService } from '../../services/reportService';
import { InterviewSession, DailyReport } from '../../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [report, setReport] = useState<DailyReport | null>(null);

  useEffect(() => {
    const list = interviewService.getAllSessions();
    setSessions(list);
    reportService.getTodayReport().then(setReport).catch(() => {});
  }, []);

  return (
    <div className="py-10 bg-[#fbfdfc] min-h-[90vh]">
      <Container>
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] bg-[#e8faf1] px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
                Candidate Dashboard
              </span>
              <span className="text-xs text-slate-400 font-medium">Ready for Practice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Target Role: <strong className="text-slate-800 font-semibold">{user?.targetRole || 'Frontend Developer'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/reports">
              <Button variant="secondary" size="md" icon={<BarChart3 className="w-4 h-4 text-slate-500" />}>
                Daily AI Report
              </Button>
            </Link>
            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={<Play className="w-3.5 h-3.5 fill-white" />}>
                Start New Session
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 card-subtle-shadow">
            <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Readiness Score</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#008f4c]">
                {report?.overallScore || 76}%
              </span>
              <span className="text-xs text-slate-500">+4% this week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 card-subtle-shadow">
            <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Today's Sessions</span>
              <Clock className="w-4 h-4 text-[#00ba66]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {sessions.length || 3}
              </span>
              <span className="text-xs text-slate-500">interviews</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 card-subtle-shadow">
            <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Questions Answered</span>
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {report?.questionsCount || 35}
              </span>
              <span className="text-xs text-slate-500">questions</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 card-subtle-shadow">
            <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Weak Topics</span>
              <span className="text-xs text-amber-500 font-bold">Needs review</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">3</span>
              <span className="text-xs text-slate-500">recommended topics</span>
            </div>
          </div>
        </div>

        {/* 2-column detailed section: Left: Recent sessions; Right: Skill Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Practice Sessions */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 card-subtle-shadow">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Interview Sessions</h2>
              <Link to="/interview/setup" className="text-xs font-semibold text-[#00ba66] hover:underline flex items-center gap-1">
                New Practice <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {sessions.length > 0 ? (
                sessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{s.role}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {s.questions.length} questions
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Topics: {s.topics.join(', ') || 'General'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e8faf1] text-[#008f4c] border border-[#b7eed4]">
                        {s.overallScore ? `${s.overallScore}%` : 'In Progress'}
                      </span>
                      <Link to={`/interview/${s.id}`}>
                        <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 p-1">
                          View →
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-500 mb-4">No sessions recorded yet today.</p>
                  <Link to="/interview/setup">
                    <Button variant="primary" size="sm">
                      Start Your First Voice Interview
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Skill Gap Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 card-subtle-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Skill Proficiency</h2>
                <Link to="/reports" className="text-xs font-semibold text-[#00ba66] hover:underline">
                  Full Report →
                </Link>
              </div>

              <div className="space-y-4">
                {(report?.skillPerformance || [
                  { skill: 'JavaScript', score: 82 },
                  { skill: 'React', score: 68 },
                  { skill: 'Node.js', score: 61 },
                  { skill: 'MongoDB', score: 84 },
                  { skill: 'SQL', score: 91 },
                ]).map((item) => (
                  <div key={item.skill}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-800">{item.skill}</span>
                      <span className="text-slate-900">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.score >= 80
                            ? 'bg-[#00ba66]'
                            : item.score >= 65
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-800">
                <strong>Next Recommendation:</strong> Practice React Hooks and Node.js Middleware to reach 80%+ benchmark.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
