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
  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        let activeSessionId = id;
        if (!activeSessionId) {
          const current = interviewService.getCurrentSession();
          if (current) {
            activeSessionId = current.id;
          }
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
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id, navigate]);
  if (loading) {
    return <Loading message="Generating your interview report..." />;
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
    totalQuestions={session?.questions.length || session?.questionCount || 5}
  />
      </Container>
    </div>;
};
