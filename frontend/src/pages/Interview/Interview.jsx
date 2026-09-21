import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../components/common/Container";
import { Loading } from "../../components/common/Loading";
import { ProgressBar } from "../../components/interview/ProgressBar";
import { InterviewQuestion } from "../../components/interview/InterviewQuestion";
import { SpeechInput } from "../../components/interview/SpeechInput";
import { AnswerBox } from "../../components/interview/AnswerBox";
import { FeedbackCard } from "../../components/interview/FeedbackCard";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { interviewService } from "../../services/interviewService";
export const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    audioLevel,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();
  useEffect(() => {
    async function loadSession() {
      if (id) {
        const found = await interviewService.getSession(id);
        if (found) {
          setSession(found);
          return;
        }
      }
      const current = interviewService.getCurrentSession();
      if (current) {
        setSession(current);
      } else {
        navigate("/interview/setup");
      }
    }
    loadSession();
  }, [id, navigate]);
  if (isGeneratingReport) {
    return <div className="py-20 min-h-[85vh] flex items-center justify-center bg-[#fbfdfc]">
        <div className="text-center p-8 max-w-md bg-white rounded-3xl border border-slate-200 card-subtle-shadow">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#e8faf1] border border-[#b7eed4] flex items-center justify-center text-[#00ba66]">
            <span className="w-8 h-8 rounded-full border-3 border-[#00ba66] border-t-transparent animate-spin inline-block" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Generating your interview report...
          </h2>
          <p className="text-xs text-slate-500">
            Our AI is analyzing your technical depth, communication, and project relevance across all answered questions.
          </p>
        </div>
      </div>;
  }
  if (!session) {
    return <Loading message="Loading interview questions..." />;
  }
  const currentQIndex = session.currentQuestionIndex;
  const displayQIndex = currentFeedback ? Math.max(0, currentQIndex - 1) : currentQIndex;
  const currentQuestion = session.questions[displayQIndex] || session.questions[0];
  const totalQuestions = session.questions.length;
  const isLastQuestion = displayQIndex + 1 >= totalQuestions;
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;
    if (isListening) {
      stopListening();
    }
    setIsSubmitting(true);
    try {
      const res = await interviewService.submitAnswer(
        session.id,
        currentQuestion.id,
        transcript.trim(),
        currentQuestion.question,
        currentQIndex + 1
      );
      setCurrentFeedback({
        score: res.score,
        feedback: res.feedback,
        evaluation: res.evaluation
      });
      setSession(res.session);
    } catch (err) {
      console.error("Submit answer error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      setIsGeneratingReport(true);
      try {
        await interviewService.getFinalReport(session.id);
      } catch (err) {
        console.warn("Report generation notice:", err);
      }
      navigate(`/interview/${session.id}/report`);
      return;
    }
    setCurrentFeedback(null);
    resetTranscript();
    if (isListening) {
      stopListening();
    }
  };
  return <div className="py-8 sm:py-12 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        <div className="space-y-6">
          {
    /* Progress Indicator */
  }
          <ProgressBar
            currentQuestion={displayQIndex + 1}
    totalQuestions={totalQuestions}
  />

          {
    /* AI Question Card */
  }
          <InterviewQuestion
    question={currentQuestion}
            questionNumber={displayQIndex + 1}
    totalQuestions={totalQuestions}
  />

          {
    /* If feedback was received, show feedback card */
  }
          {currentFeedback ? <FeedbackCard
    score={currentFeedback.score}
    feedback={currentFeedback.feedback}
    evaluation={currentFeedback.evaluation}
    isLastQuestion={isLastQuestion}
    onNext={handleNextQuestion}
    isLoadingNext={isGeneratingReport}
  /> : <>
              {
    /* Microphone & Audio Recording Input */
  }
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 card-subtle-shadow text-center">
                <SpeechInput
    isListening={isListening}
    audioLevel={audioLevel}
    isSupported={isSupported}
    errorMessage={errorMessage}
    onStartListening={startListening}
    onStopListening={stopListening}
    disabled={isSubmitting}
  />
              </div>

              {
    /* Dynamic Transcript Display & Review/Edit & Submit Answer Box */
  }
              <AnswerBox
    transcript={transcript}
    interimTranscript={interimTranscript}
    isListening={isListening}
    onTranscriptChange={(newText) => setTranscript(newText)}
    onSubmit={handleSubmitAnswer}
    isSubmitting={isSubmitting}
    disabled={isSubmitting}
  />
            </>}
        </div>
      </Container>
    </div>;
};
