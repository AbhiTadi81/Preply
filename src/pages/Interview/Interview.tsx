import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { Loading } from '../../components/common/Loading';
import { ProgressBar } from '../../components/interview/ProgressBar';
import { InterviewQuestion } from '../../components/interview/InterviewQuestion';
import { SpeechInput } from '../../components/interview/SpeechInput';
import { AnswerBox } from '../../components/interview/AnswerBox';
import { FeedbackCard } from '../../components/interview/FeedbackCard';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { interviewService } from '../../services/interviewService';
import { InterviewSession, AnswerEvaluation } from '../../types';

export const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{
    score: number;
    feedback: string;
    evaluation?: AnswerEvaluation;
  } | null>(null);

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
    resetTranscript,
    simulateVoiceInput,
  } = useSpeechRecognition();

  const handleSimulateSpeech = () => {
    const qText = (currentQuestion?.question || '').toLowerCase();
    let sample = '';
    if (qText.includes('outlier') || qText.includes('skew') || qText.includes('data') || qText.includes('distribution')) {
      sample = "In our machine learning pipeline, we detected skewed data distributions and extreme outliers by computing interquartile ranges and applying logarithmic transformations. We also used robust scaling to prevent high-leverage outliers from disproportionately influencing model convergence.";
    } else if (qText.includes('scale') || qText.includes('system') || qText.includes('architecture') || qText.includes('database') || qText.includes('microservice')) {
      sample = "To handle scale reliably, we decoupled high-throughput write streams using an event-driven message queue with Redis caching in front of our primary database. This dropped p99 API latencies by over 40% and prevented connection pool exhaustion during peak traffic.";
    } else if (qText.includes('challenge') || qText.includes('bug') || qText.includes('debug') || qText.includes('difficult')) {
      sample = "A critical technical challenge was diagnosing intermittent latency spikes in production. We profiled request traces, identified lock contention in our database transactions, and refactored the operations to use optimistic concurrency control.";
    } else {
      sample = "In this scenario, I first break down the core system requirements and edge cases, establish quantitative evaluation metrics and unit tests, and iteratively refine the implementation while monitoring accuracy and latency.";
    }
    simulateVoiceInput(sample);
  };

  useEffect(() => {
    async function loadSession() {
      if (id) {
        const found = await interviewService.getSession(id);
        if (found) {
          setSession(found);
          return;
        }
      }
      // If no ID or ID not found, check current or fallback
      const current = interviewService.getCurrentSession();
      if (current) {
        setSession(current);
      } else {
        navigate('/interview/setup');
      }
    }

    loadSession();
  }, [id, navigate]);

  if (isGeneratingReport) {
    return (
      <div className="py-20 min-h-[85vh] flex items-center justify-center bg-[#fbfdfc]">
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
      </div>
    );
  }

  if (!session) {
    return <Loading message="Loading interview questions..." />;
  }

  const currentQIndex = session.currentQuestionIndex;
  const currentQuestion = session.questions[currentQIndex] || session.questions[0];
  const totalQuestions = session.questions.length;
  const isLastQuestion = currentQIndex + 1 >= totalQuestions;

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
        evaluation: res.evaluation,
      });
      setSession(res.session);
    } catch (err) {
      console.error('Submit answer error:', err);
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
        console.warn('Report generation notice:', err);
      }
      navigate(`/interview/${session.id}/report`);
      return;
    }

    // Reset for next question
    setCurrentFeedback(null);
    resetTranscript();
    if (isListening) {
      stopListening();
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        <div className="space-y-6">
          {/* Progress Indicator */}
          <ProgressBar
            currentQuestion={currentQIndex + 1}
            totalQuestions={totalQuestions}
          />

          {/* AI Question Card */}
          <InterviewQuestion
            question={currentQuestion}
            questionNumber={currentQIndex + 1}
            totalQuestions={totalQuestions}
          />

          {/* If feedback was received, show feedback card */}
          {currentFeedback ? (
            <FeedbackCard
              score={currentFeedback.score}
              feedback={currentFeedback.feedback}
              evaluation={currentFeedback.evaluation}
              isLastQuestion={isLastQuestion}
              onNext={handleNextQuestion}
              isLoadingNext={isGeneratingReport}
            />
          ) : (
            <>
              {/* Microphone & Audio Recording Input */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 card-subtle-shadow text-center">
                <SpeechInput
                  isListening={isListening}
                  audioLevel={audioLevel}
                  isSupported={isSupported}
                  errorMessage={errorMessage}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  disabled={isSubmitting}
                  onSimulateSpeech={handleSimulateSpeech}
                />
              </div>

              {/* Dynamic Transcript Display & Review/Edit & Submit Answer Box */}
              <AnswerBox
                transcript={transcript}
                interimTranscript={interimTranscript}
                isListening={isListening}
                onTranscriptChange={(newText) => setTranscript(newText)}
                onSubmit={handleSubmitAnswer}
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
                onSimulateSpeech={handleSimulateSpeech}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
