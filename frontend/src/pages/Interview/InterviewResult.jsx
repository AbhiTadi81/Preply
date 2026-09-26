import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../components/common/Container";
import { Loading } from "../../components/common/Loading";
import { ReportCard } from "../../components/interview/ReportCard";
import { interviewService } from "../../services/interviewService";
export const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        let activeSessionId = id;
        if (!activeSessionId) {
          const current = interviewService.getCurrentSession();
          activeSessionId = current?.id || interviewService.getCurrentSessionId();
        }
        if (activeSessionId) {
          const sess = await interviewService.getSession(activeSessionId);
          setSession(sess);
          const finalReport = await interviewService.getFinalReport(activeSessionId);
          setReport(finalReport);
        } else {
          navigate("/interview/setup");
        }
      } catch (err) {
        console.error("Failed to load final report:", err);
        setError(err?.message || "Failed to generate interview report using AI service.");
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id, navigate]);

  if (loading) {
    return <Loading message="Generating your interview report..." />;
  }

  if (error) {
    return (
      <div className="py-20 min-h-[85vh] flex items-center justify-center bg-[#fbfdfc]">
        <div className="text-center p-8 max-w-md bg-white rounded-3xl border border-rose-200 card-subtle-shadow">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Report Generation Error
          </h2>
          <p className="text-xs text-rose-600 mb-6 font-medium">
            {error}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-2xl bg-[#00ba66] hover:bg-[#00a85b] text-white font-bold text-sm transition-all cursor-pointer"
            >
              Retry Generating Report
            </button>
            <button
              onClick={() => navigate("/interview/setup")}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return <div className="py-20 min-h-[85vh] flex items-center justify-center bg-[#fbfdfc]">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-4">
            No interview report was found for this session.
          </p>
          <button
      onClick={() => navigate("/interview/setup")}
      className="px-6 py-3 rounded-2xl bg-[#00ba66] text-white font-bold text-sm"
    >
            Start New Interview
          </button>
        </div>
      </div>;
  }
  return <div className="py-10 sm:py-16 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        <ReportCard
    report={report}
    resumeFileName={session?.resumeFileName || "Candidate_Resume.pdf"}
    totalQuestions={session?.questions?.length || session?.questionCount || 5}
  />
      </Container>
    </div>;
};

