import { Clock, Sun, Sunset, Moon, TrendingUp, Calendar } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
export const ProgressSection = () => {
  const sessions = [
    {
      timeOfDay: "Morning",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      topic: "JavaScript",
      subtopic: "Closures & Prototypes",
      questions: 10,
      score: 82,
      time: "09:15 AM",
      scoreColor: "text-[#008f4c] bg-[#e8faf1] border-[#b7eed4]"
    },
    {
      timeOfDay: "Afternoon",
      icon: <Sunset className="w-5 h-5 text-orange-500" />,
      topic: "SQL",
      subtopic: "Joins & Indexes",
      questions: 10,
      score: 91,
      time: "02:30 PM",
      scoreColor: "text-[#008f4c] bg-[#e8faf1] border-[#b7eed4]"
    },
    {
      timeOfDay: "Evening",
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      topic: "Full Stack",
      subtopic: "API Design & Auth",
      questions: 15,
      score: 68,
      time: "07:45 PM",
      scoreColor: "text-amber-700 bg-amber-50 border-amber-200"
    }
  ];
  return <section className="py-20 sm:py-28 bg-[#fcfdfd] border-t border-slate-100">
      <Container>
        {
    /* Section Header */
  }
        <SectionHeader
    badgeIcon={<Calendar className="w-3.5 h-3.5" />}
    badgeText="Session Continuity"
    title="Your progress continues across every session."
    description="Every interview session builds upon the previous one. Practice freely throughout the day with persistent tracking."
  />

        {
    /* 3 Session Cards matching reference specifications */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {sessions.map((session) => <div
    key={session.timeOfDay}
    className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 card-subtle-shadow hover:border-slate-300 transition-all"
  >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {session.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {session.timeOfDay}
                    </span>
                    <p className="text-[11px] text-slate-400">{session.time}</p>
                  </div>
                </div>

                <span
    className={`text-xs font-bold px-3 py-1 rounded-full border ${session.scoreColor}`}
  >
                  {session.score}%
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-1">
                {session.topic}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Focus: {session.subtopic}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{session.questions} Questions</span>
                </div>
                <span className="text-[#00ba66] font-semibold flex items-center">
                  Completed
                </span>
              </div>
            </div>)}
        </div>

        {
    /* Progress formula visual banner */
  }
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 sm:p-8 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-[#008f4c]">
            <TrendingUp className="w-4 h-4" />
            <span>The Continuous Loop</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-800 my-4">
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full">Multiple Sessions</span>
            <span className="text-slate-400">+</span>
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full">Persistent History</span>
            <span className="text-slate-400">+</span>
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-full">Skill Tracking</span>
            <span className="text-[#00ba66] font-bold text-base sm:text-lg">=</span>
            <span className="bg-[#e8faf1] text-[#008f4c] border border-[#b7eed4] px-4 py-1.5 rounded-full font-bold">
              Daily Analysis
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
            Instead of ephemeral chat completions, your response evaluations compound into an actionable learning curve.
          </p>
        </div>
      </Container>
    </section>;
};
