import React from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Sparkles, Play } from 'lucide-react';

interface SpeechInputProps {
  isListening: boolean;
  audioLevel: number;
  isSupported: boolean;
  errorMessage: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
  onSimulateSpeech?: () => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({
  isListening,
  audioLevel,
  isSupported,
  errorMessage,
  onStartListening,
  onStopListening,
  disabled = false,
  onSimulateSpeech,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      {/* Dynamic Visual Pulse Rings when active */}
      <div className="relative flex items-center justify-center mb-3">
        {isListening && (
          <>
            <span
              className="absolute w-24 h-24 rounded-full bg-[#00ba66]/20 animate-ping"
              style={{ animationDuration: '2s' }}
            />
            <span
              className="absolute w-20 h-20 rounded-full bg-[#00ba66]/30 animate-pulse"
              style={{
                transform: `scale(${1 + (audioLevel / 100) * 0.3})`,
                transition: 'transform 0.1s ease-out',
              }}
            />
          </>
        )}

        <button
          type="button"
          id="toggle-mic-btn"
          disabled={disabled}
          onClick={isListening ? onStopListening : onStartListening}
          className={`relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200'
              : 'bg-[#00ba66] hover:bg-[#00a85b] text-white ring-4 ring-[#00ba66]/20 hover:shadow-xl'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isListening ? 'Click to stop speaking and finish your answer' : 'Click to start speaking your answer'}
        >
          {isListening ? (
            <MicOff className="w-7 h-7 animate-bounce" />
          ) : (
            <Mic className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Status indicator & live audio wave display */}
      <div className="text-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening... Spoken words update dynamically</span>
            </div>

            {/* Live Audio Level Equalizer Bars */}
            <div className="flex items-center gap-1 h-5 mt-1">
              {[12, 28, 45, 70, 95, 70, 45, 28, 12].map((height, i) => {
                const scaled = Math.max(
                  4,
                  Math.round((height * (Math.max(15, audioLevel) / 100)))
                );
                return (
                  <div
                    key={i}
                    className="w-1 bg-[#00ba66] rounded-full transition-all duration-75"
                    style={{ height: `${scaled}px` }}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Click the microphone to speak your answer dynamically</span>
            </div>

            {onSimulateSpeech && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-400">or</span>
                <button
                  type="button"
                  id="simulate-speech-btn"
                  onClick={onSimulateSpeech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#e8faf1] border border-slate-200 hover:border-[#b7eed4] text-slate-700 hover:text-[#008f4c] text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#00ba66]" />
                  <span>Test Voice Transcription (Sample Voice)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fallback info when speech API encounters browser or iframe restrictions */}
      {errorMessage && (
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-lg w-full text-xs text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-2xl text-left">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>

          {onSimulateSpeech && (
            <button
              type="button"
              onClick={onSimulateSpeech}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-[11px] hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Play className="w-3 h-3 text-amber-700 fill-amber-700" />
              <span>Simulate Voice</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
