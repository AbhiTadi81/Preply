import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic, MicOff, Sparkles, LineChart, Zap, CheckCircle2, RotateCcw, Volume2, ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
const DEMO_TRANSCRIPT = "The JavaScript event loop continuously monitors the call stack and callback queue. When the call stack is empty, microtasks like Promise handlers and queueMicrotask are prioritized and executed immediately before any macrotasks like setTimeout or I/O events.";
export const ProcessSection = () => {
  const {
    isListening,
    liveTranscript,
    setTranscript,
    startListening,
    stopListening,
    resetTranscript,
    audioLevel,
    errorMessage
  } = useSpeechRecognition();
  const [displayedText, setDisplayedText] = useState(DEMO_TRANSCRIPT);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  useEffect(() => {
    if (isListening) {
      if (liveTranscript) {
        setDisplayedText(liveTranscript);
      } else {
        setDisplayedText("Listening to your microphone... Speak clearly now.");
      }
    }
  }, [isListening, liveTranscript]);
  const handleStartDemo = () => {
    if (isListening) stopListening();
    setIsEvaluated(false);
    setIsDemoRunning(true);
    setActiveTab("demo");
    setDisplayedText("");
    const words = DEMO_TRANSCRIPT.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        const nextWord = words[index];
        setDisplayedText((prev) => prev ? `${prev} ${nextWord}` : nextWord);
        index++;
      } else {
        clearInterval(interval);
        setIsDemoRunning(false);
      }
    }, 180);
  };
  const handleToggleMic = () => {
    setIsEvaluated(false);
    setIsDemoRunning(false);
    setActiveTab("live");
    if (isListening) {
      stopListening();
    } else {
      setDisplayedText("");
      resetTranscript();
      startListening();
    }
  };
  const handleSubmitEvaluation = () => {
    if (isListening) stopListening();
    setIsDemoRunning(false);
    setIsEvaluated(true);
  };
  const handleReset = () => {
    if (isListening) stopListening();
    setIsDemoRunning(false);
    setIsEvaluated(false);
    setDisplayedText(DEMO_TRANSCRIPT);
    resetTranscript();
  };
  return <section id="how-it-works" className="py-20 sm:py-28 bg-white border-t border-slate-100/60">
      <Container>
        {
    /* Section Header */
  }
        <SectionHeader
    badgeIcon={<Zap className="w-3.5 h-3.5" />}
    badgeText="Interactive Demo"
    title="Practice. Speak. Improve."
    description="Experience real-time voice interview practice. Test your microphone below or watch the live AI transcription in action."
  />

        {
    /* 2-column layout */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {
    /* LEFT: Interactive live mockup representing the AI Interview Screen */
  }
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 card-subtle-shadow overflow-hidden">
              {
    /* Header bar of the mockup */
  }
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isListening || isDemoRunning ? "bg-rose-500 animate-ping" : "bg-[#00ba66]"}`} />
                  <span className="font-semibold text-slate-800">
                    {isListening ? "Live Microphone Active" : isDemoRunning ? "Simulating Voice Input" : "Interview Session Preview"}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">• Role: Frontend Engineer</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
    type="button"
    onClick={handleReset}
    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
    title="Reset interactive preview"
  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  <span className="font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                    Interactive
                  </span>
                </div>
              </div>

              {
    /* Question bubble */
  }
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Technical Question
                  </span>
                  <span className="text-xs text-slate-400">JavaScript • Async Architecture</span>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                  Explain the JavaScript event loop and how microtasks differ from macrotasks.
                </h4>
              </div>

              {
    /* Voice Answer & Live Speech-to-Text interactive box */
  }
              <div className="rounded-2xl border border-emerald-100 bg-[#fbfdfc] p-4 sm:p-5 mb-4 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {
    /* Clickable Microphone Button */
  }
                    <button
    type="button"
    onClick={handleToggleMic}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${isListening ? "bg-rose-500 text-white ring-4 ring-rose-100 animate-pulse" : "bg-[#00ba66] hover:bg-[#00a458] text-white ring-4 ring-emerald-50"}`}
    title={isListening ? "Click to stop microphone" : "Click to speak using your microphone"}
  >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {isListening ? <span className="text-rose-600">Recording live speech...</span> : isDemoRunning ? <span className="text-[#008f4c]">Streaming dynamic speech...</span> : <span>Voice Detection Ready</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isListening ? "Speak into your mic to see live text" : "Click mic to speak, or run dynamic demo"}
                      </p>
                    </div>
                  </div>

                  {
    /* Mode switcher pills & animated sound wave */
  }
                  <div className="flex items-center gap-2">
                    <button
    type="button"
    onClick={handleStartDemo}
    disabled={isDemoRunning}
    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "demo" && isDemoRunning ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
  >
                      <Volume2 className="w-3.5 h-3.5 text-[#00ba66]" />
                      <span>{isDemoRunning ? "Streaming..." : "Simulate Voice"}</span>
                    </button>

                    {
    /* Animated sound wave bars reacting to activity */
  }
                    <div className="flex items-center gap-1 h-5 px-2 py-1 bg-white rounded-lg border border-slate-100">
                      <span
    className={`w-1 rounded-full bg-[#00ba66] transition-all duration-75 ${isListening || isDemoRunning ? "h-4 animate-bounce [animation-delay:-0.3s]" : "h-1.5 opacity-40"}`}
  />
                      <span
    className={`w-1 rounded-full bg-[#00ba66] transition-all duration-75 ${isListening || isDemoRunning ? "h-6 animate-bounce [animation-delay:-0.15s]" : "h-3 opacity-40"}`}
  />
                      <span
    className={`w-1 rounded-full bg-[#00ba66] transition-all duration-75 ${isListening || isDemoRunning ? "h-3 animate-bounce [animation-delay:-0.4s]" : "h-1.5 opacity-40"}`}
  />
                      <span
    className={`w-1 rounded-full bg-[#00ba66] transition-all duration-75 ${isListening || isDemoRunning ? "h-5 animate-bounce" : "h-2.5 opacity-40"}`}
  />
                      <span
    className={`w-1 rounded-full bg-[#00ba66] transition-all duration-75 ${isListening || isDemoRunning ? "h-4 animate-bounce [animation-delay:-0.2s]" : "h-1.5 opacity-40"}`}
  />
                    </div>
                  </div>
                </div>

                {
    /* Error message if mic blocked */
  }
                {errorMessage && <div className="mb-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    {errorMessage}
                  </div>}

                {
    /* Dynamic Live Transcript Display */
  }
                <div className="relative bg-white border border-slate-200/90 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal min-h-[85px] transition-all">
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-50 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Live Speech-to-Text Transcription
                    </span>
                    <span>
                      {displayedText.trim() ? `${displayedText.trim().split(/\s+/).length} words` : "0 words"}
                    </span>
                  </div>

                  <p className="text-slate-800">
                    {displayedText || <span className="text-slate-400 italic">
                        Speech will transcribe here dynamically in real-time...
                      </span>}
                    {(isListening || isDemoRunning) && <span className="inline-block w-1.5 h-4 bg-[#00ba66] ml-1 align-middle animate-pulse rounded-full" />}
                  </p>
                </div>
              </div>

              {
    /* Evaluation Result or Action Bar */
  }
              {isEvaluated ? <div className="p-4 rounded-2xl bg-[#e8faf1] border border-[#b7eed4] text-slate-800 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#00ba66]" />
                      <span className="text-xs font-bold text-[#008f4c] uppercase tracking-wider">
                        AI Assessment: 92 / 100
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
                      Strong Performance
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    Clear differentiation between the call stack, microtask queue, and macrotask queue. You correctly identified Promises as microtasks and setTimeout as a macrotask.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#b7eed4]/60 text-xs">
                    <span className="text-slate-600 font-medium">Ready for full mock interview?</span>
                    <Link
    to="/interview/setup"
    className="font-bold text-[#008f4c] hover:underline flex items-center gap-1"
  >
                      Start Full Interview <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div> : <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-[#00ba66]" />
                    <span>Transcribes audio instantly with browser Speech Recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
    type="button"
    onClick={handleSubmitEvaluation}
    disabled={!displayedText.trim() || isListening || isDemoRunning}
    className="text-xs font-semibold px-4 py-2 rounded-full bg-[#00ba66] text-white hover:bg-[#00a458] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
  >
                      Evaluate Answer
                    </button>
                  </div>
                </div>}
            </div>
          </div>

          {
    /* RIGHT: Feature cards */
  }
          <div className="lg:col-span-5 flex flex-col gap-4">
            {
    /* Primary Feature Card */
  }
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 card-subtle-shadow hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#e8faf1] text-[#008f4c] flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                AI Voice Interviews
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Answer interview questions naturally using your voice. Your responses are converted into text in real-time and evaluated across technical accuracy and clarity.
              </p>
            </div>

            {
    /* Feature Card 2 */
  }
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 card-subtle-shadow hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                AI Answer Evaluation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get technical, clarity, completeness, and overall feedback tailored to the specific job role and question difficulty.
              </p>
            </div>

            {
    /* Feature Card 3 */
  }
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 card-subtle-shadow hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008f4c] flex items-center justify-center mb-4">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Skill Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your performance across different skills and subtopics over multiple sessions to target exact knowledge gaps.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>;
};
