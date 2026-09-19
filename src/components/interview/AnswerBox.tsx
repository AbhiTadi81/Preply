import React, { useEffect, useRef } from 'react';
import { Send, Edit3, Trash2, Loader2, Mic, Sparkles } from 'lucide-react';

interface AnswerBoxProps {
  transcript: string;
  interimTranscript?: string;
  isListening?: boolean;
  onTranscriptChange: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
  onSimulateSpeech?: () => void;
}

export const AnswerBox: React.FC<AnswerBoxProps> = ({
  transcript,
  interimTranscript = '',
  isListening = false,
  onTranscriptChange,
  onSubmit,
  isSubmitting,
  disabled = false,
  onSimulateSpeech,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const canSubmit = transcript.trim().length > 0 && !isSubmitting && !disabled;

  // Auto scroll textarea when transcript grows dynamically during speech
  useEffect(() => {
    if (isListening && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcript, isListening]);

  return (
    <div
      id="answer-box-container"
      className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 card-subtle-shadow transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-[#00ba66]" />
          <label
            htmlFor="answer-transcript-textarea"
            className="text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Your Answer (Editable Transcript)
          </label>
        </div>

        <div className="flex items-center gap-3">
          {/* Live speech status tag */}
          {isListening && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8faf1] border border-[#b7eed4] text-[#008f4c] text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00ba66] animate-ping" />
              Live Speech Updating
            </span>
          )}

          <span className="text-xs font-medium text-slate-400">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>

          {transcript && !isSubmitting && (
            <button
              type="button"
              id="clear-answer-btn"
              onClick={() => onTranscriptChange('')}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear answer text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editable Textarea with live dynamic speech update */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="answer-transcript-textarea"
          rows={5}
          disabled={disabled || isSubmitting}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Speak using the microphone above, or type your answer here directly. Your spoken words will update here dynamically in real time, and you can edit them anytime before submitting..."
          className={`w-full text-slate-800 text-sm leading-relaxed p-4 rounded-2xl transition-all resize-y min-h-[120px] focus:outline-none ${
            isListening
              ? 'bg-[#f7fdfa] border-2 border-[#00ba66] ring-2 ring-[#00ba66]/20'
              : 'bg-slate-50/70 border border-slate-200 focus:border-[#00ba66] focus:bg-white focus:ring-2 focus:ring-[#00ba66]/20'
          }`}
        />

        {/* Live speech feedback banner when active */}
        {isListening && interimTranscript && (
          <div className="mt-2 px-3.5 py-2 rounded-xl bg-[#e8faf1]/80 border border-[#b7eed4] flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2 truncate">
              <Mic className="w-3.5 h-3.5 text-[#00ba66] shrink-0 animate-bounce" />
              <span className="font-semibold text-slate-700">Capturing:</span>
              <span className="italic text-emerald-700 font-medium truncate">"{interimTranscript}..."</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#008f4c] bg-white px-2 py-0.5 rounded-md border border-[#b7eed4] shrink-0">
              Live Voice
            </span>
          </div>
        )}
      </div>

      {/* Footer with Submit and Helper Options */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-500">
            Review and refine your transcript anytime for precision before submitting.
          </p>
          {onSimulateSpeech && !transcript && !isListening && (
            <button
              type="button"
              onClick={onSimulateSpeech}
              className="text-xs text-[#008f4c] hover:text-[#00ba66] font-semibold inline-flex items-center gap-1 cursor-pointer underline hover:no-underline"
              title="Test voice transcription with sample candidate answer"
            >
              <Sparkles className="w-3 h-3 text-[#00ba66]" />
              <span>Simulate Voice</span>
            </button>
          )}
        </div>

        <button
          type="button"
          id="submit-answer-btn"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm cursor-pointer ${
            canSubmit
              ? 'bg-[#00ba66] hover:bg-[#00a85b] text-white shadow-[#00ba66]/20 active:scale-95'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing your answer...</span>
            </>
          ) : (
            <>
              <span>Submit Answer</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
