import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import { reportService } from "../../services/reportService";
import { formatDate } from "../../utils/helpers";
export const ReportHistory = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    reportService.getHistory().then(setHistory).catch(() => {
    });
  }, []);
  return <div className="py-10 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#008f4c] bg-[#e8faf1] px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
              Historical Logs
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Daily AI Report History
            </h1>
          </div>
          <Link to="/reports">
            <Button variant="secondary" size="md">
              Today's Report
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {history.map((rep) => <div
    key={rep.id}
    className="bg-white rounded-3xl border border-slate-200/90 p-6 card-subtle-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {formatDate(rep.date)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rep.interviewsCount} sessions • {rep.questionsCount} questions evaluated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Daily Score</span>
                  <span className="text-xl font-extrabold text-[#008f4c]">
                    {rep.overallScore}%
                  </span>
                </div>
                <Link to="/reports">
                  <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>)}
        </div>
      </Container>
    </div>;
};
