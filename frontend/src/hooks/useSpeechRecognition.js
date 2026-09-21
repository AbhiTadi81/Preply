import { useState, useEffect, useRef, useCallback } from "react";
function getSpeechRecognitionClass() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const simulationIntervalRef = useRef(null);
  const isExplicitStopRef = useRef(false);
  const isListeningRef = useRef(false);
  const committedTextRef = useRef("");
  const interimTranscriptRef = useRef("");
  const transcriptRef = useRef("");
  useEffect(() => {
    const SpeechClass = getSpeechRecognitionClass();
    if (!SpeechClass) {
      setIsSupported(false);
    }
  }, []);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {
      }
      audioContextRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setAudioLevel(0);
  }, []);
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
        }
      }
    };
  }, [cleanupAudio]);
  const setupAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round(avg / 128 * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.warn("Microphone audio analyser stream notice:", err);
    }
  }, []);
  const setTranscriptExternal = useCallback((newText) => {
    committedTextRef.current = newText;
    interimTranscriptRef.current = "";
    transcriptRef.current = newText;
    setInterimTranscript("");
    setTranscript(newText);
  }, []);
  const stopListening = useCallback(() => {
    isExplicitStopRef.current = true;
    isListeningRef.current = false;
    if (interimTranscriptRef.current) {
      const merged = committedTextRef.current ? `${committedTextRef.current.trim()} ${interimTranscriptRef.current.trim()}` : interimTranscriptRef.current.trim();
      committedTextRef.current = merged;
      transcriptRef.current = merged;
      setTranscript(merged);
      setInterimTranscript("");
      interimTranscriptRef.current = "";
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
      }
      recognitionRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsListening(false);
    cleanupAudio();
  }, [cleanupAudio]);
  const startListening = useCallback(async () => {
    setErrorMessage(null);
    isExplicitStopRef.current = false;
    isListeningRef.current = true;
    committedTextRef.current = transcriptRef.current;
    interimTranscriptRef.current = "";
    setInterimTranscript("");
    const SpeechClass = getSpeechRecognitionClass();
    setupAudioMeter().catch(() => {
    });
    if (!SpeechClass) {
      setIsSupported(false);
      setErrorMessage(
        "Speech recognition is not supported in this browser or iframe. You can type your answer directly."
      );
      setIsListening(false);
      isListeningRef.current = false;
      return;
    }
    const startFreshInstance = () => {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {
          }
        }
        const recognition = new SpeechClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          setErrorMessage(null);
        };
        recognition.onresult = (event) => {
          let finalChunk = "";
          let interimChunk = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalChunk += res[0].transcript + " ";
            } else {
              interimChunk += res[0].transcript;
            }
          }
          if (finalChunk) {
            committedTextRef.current = committedTextRef.current ? `${committedTextRef.current.trim()} ${finalChunk.trim()}` : finalChunk.trim();
          }
          interimTranscriptRef.current = interimChunk;
          setInterimTranscript(interimChunk);
          const liveText = committedTextRef.current ? interimChunk ? `${committedTextRef.current.trim()} ${interimChunk.trim()}` : committedTextRef.current : interimChunk.trim();
          setTranscript(liveText);
          transcriptRef.current = liveText;
        };
        recognition.onerror = (event) => {
          console.warn("SpeechRecognition error:", event.error);
          if (event.error === "not-allowed") {
            setErrorMessage("Microphone access was denied or blocked by browser permissions. You can type your answer directly.");
            setIsListening(false);
            isListeningRef.current = false;
            cleanupAudio();
          } else if (event.error === "no-speech") {
          } else if (event.error === "network") {
            setErrorMessage("The browser speech recognition service is unavailable. Check your browser permissions or type your answer directly.");
            setIsListening(false);
            isListeningRef.current = false;
            cleanupAudio();
          }
        };
        recognition.onend = () => {
          if (!isExplicitStopRef.current && isListeningRef.current) {
            if (interimTranscriptRef.current) {
              const merged = committedTextRef.current ? `${committedTextRef.current.trim()} ${interimTranscriptRef.current.trim()}` : interimTranscriptRef.current.trim();
              committedTextRef.current = merged;
              transcriptRef.current = merged;
              setTranscript(merged);
              setInterimTranscript("");
              interimTranscriptRef.current = "";
            }
            try {
              startFreshInstance();
              return;
            } catch {
            }
          }
          setIsListening(false);
          isListeningRef.current = false;
          cleanupAudio();
        };
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.warn("SpeechRecognition initialization error:", err);
        setErrorMessage("Could not activate speech recognition. You can type your answer directly.");
        setIsListening(false);
        isListeningRef.current = false;
        cleanupAudio();
      }
    };
    startFreshInstance();
  }, [cleanupAudio, setupAudioMeter]);
  const resetTranscript = useCallback(() => {
    committedTextRef.current = "";
    interimTranscriptRef.current = "";
    transcriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
  }, []);
  const simulateVoiceInput = useCallback(
    (sampleText) => {
      stopListening();
      isListeningRef.current = true;
      setIsListening(true);
      setErrorMessage(null);
      const words = sampleText.split(" ");
      let currentIndex = 0;
      const baseText = committedTextRef.current ? `${committedTextRef.current.trim()} ` : "";
      const volumeInterval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 55) + 35);
      }, 100);
      simulationIntervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          const nextPartial = words.slice(0, currentIndex + 1).join(" ");
          const dynamicText = baseText + nextPartial;
          committedTextRef.current = dynamicText;
          transcriptRef.current = dynamicText;
          setTranscript(dynamicText);
          setInterimTranscript(words[currentIndex]);
          currentIndex++;
        } else {
          if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
            simulationIntervalRef.current = null;
          }
          clearInterval(volumeInterval);
          setIsListening(false);
          isListeningRef.current = false;
          setInterimTranscript("");
          setAudioLevel(0);
        }
      }, 150);
    },
    [stopListening]
  );
  return {
    isListening,
    transcript,
    liveTranscript: transcript,
    setTranscript: setTranscriptExternal,
    interimTranscript,
    audioLevel,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
    simulateVoiceInput
  };
}
