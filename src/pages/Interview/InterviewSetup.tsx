import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { ResumeUploader } from '../../components/interview/ResumeUploader';
import { QuestionSelector } from '../../components/interview/QuestionSelector';
import { interviewService } from '../../services/interviewService';

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeContent, setResumeContent] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (file: File | null, contentText?: string) => {
    setSelectedFile(file);
    setResumeContent(contentText || (file ? file.name : ''));
    setErrorMessage(null);
  };

  const isFormValid = selectedFile !== null && questionCount !== null;

  const handleStartInterview = async () => {
    if (!isFormValid || !selectedFile || !questionCount || isStarting) return;

    setIsStarting(true);
    setErrorMessage(null);

    try {
      const session = await interviewService.createSession({
        resumeFileName: selectedFile.name,
        resumeContent: resumeContent,
        questionCount: questionCount,
        role: 'Full Stack & Software Engineer',
        topics: ['System Design', 'Project Architecture', 'Machine Learning'],
      });

      navigate(`/interview/${session.id}`);
    } catch (err) {
      console.error('Failed to start interview session:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create interview session. Please try again.'
      );
      setIsStarting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="md">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 card-subtle-shadow">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8faf1] text-[#008f4c] text-xs font-bold border border-[#b7eed4] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Interview</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Start Your Practice Interview
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Upload your resume and select the number of questions. Our AI will analyze your experience and conduct an interactive dynamic mock interview.
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Resume Upload Section */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Upload your resume
              </label>
              <ResumeUploader
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                disabled={isStarting}
              />
            </div>

            {/* 2. Number of Questions Selector */}
            <div className="pt-2">
              <QuestionSelector
                selectedCount={questionCount}
                onSelectCount={(count) => setQuestionCount(count)}
                disabled={isStarting}
              />
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* 3. Action Section with Start Interview Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-4">
              <button
                type="button"
                id="start-interview-btn"
                disabled={!isFormValid || isStarting}
                onClick={handleStartInterview}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-md active:scale-95 cursor-pointer min-w-[220px] ${
                  isFormValid && !isStarting
                    ? 'bg-[#00ba66] hover:bg-[#00a85b] text-white shadow-[#00ba66]/20'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Interview...</span>
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#008f4c]" />
                <span>Your resume is analyzed privately in-session to generate questions</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
