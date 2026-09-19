import { useState, useEffect, useRef, useCallback } from 'react';

// Declarations for browser SpeechRecognition API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  onstart?: () => void;
}

// Global window check for SpeechRecognition constructors
function getSpeechRecognitionClass(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition ||
    null
  );
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0); // 0 to 100 volume level
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isExplicitStopRef = useRef(false);
  const isListeningRef = useRef(false);

  // References to keep transcript state synced immediately during callbacks
  const committedTextRef = useRef('');
  const interimTranscriptRef = useRef('');
  const transcriptRef = useRef('');

  useEffect(() => {
    const SpeechClass = getSpeechRecognitionClass();
    if (!SpeechClass) {
      setIsSupported(false);
    }
  }, []);

  // Synchronize transcriptRef with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Cleanup audio tracks and recognition on unmount
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
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
          // ignore
        }
      }
    };
  }, [cleanupAudio]);

  // Audio level meter analyser using Web Audio API
  const setupAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Microphone audio analyser stream notice:', err);
    }
  }, []);

  // Update transcript from external changes (e.g. user editing in AnswerBox)
  const setTranscriptExternal = useCallback((newText: string) => {
    committedTextRef.current = newText;
    interimTranscriptRef.current = '';
    transcriptRef.current = newText;
    setInterimTranscript('');
    setTranscript(newText);
  }, []);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    isExplicitStopRef.current = true;
    isListeningRef.current = false;

    // Immediately commit any pending interim words to final transcript
    if (interimTranscriptRef.current) {
      const merged = committedTextRef.current
        ? `${committedTextRef.current.trim()} ${interimTranscriptRef.current.trim()}`
        : interimTranscriptRef.current.trim();
      committedTextRef.current = merged;
      transcriptRef.current = merged;
      setTranscript(merged);
      setInterimTranscript('');
      interimTranscriptRef.current = '';
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
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

  // Start speech recognition
  const startListening = useCallback(async () => {
    setErrorMessage(null);
    isExplicitStopRef.current = false;
    isListeningRef.current = true;

    // Capture currently typed/spoken text as the baseline
    committedTextRef.current = transcriptRef.current;
    interimTranscriptRef.current = '';
    setInterimTranscript('');

    const SpeechClass = getSpeechRecognitionClass();

    // Start microphone audio visualizer
    setupAudioMeter().catch(() => {});

    if (!SpeechClass) {
      setIsSupported(false);
      setErrorMessage(
        'Speech recognition API is not supported in this browser or iframe. You can type directly or use the "Try Sample Spoken Answer" button.'
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
            // ignore
          }
        }

        const recognition = new SpeechClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          setErrorMessage(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalChunk = '';
          let interimChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalChunk += res[0].transcript + ' ';
            } else {
              interimChunk += res[0].transcript;
            }
          }

          if (finalChunk) {
            committedTextRef.current = committedTextRef.current
              ? `${committedTextRef.current.trim()} ${finalChunk.trim()}`
              : finalChunk.trim();
          }

          interimTranscriptRef.current = interimChunk;
          setInterimTranscript(interimChunk);

          // LIVE DYNAMIC UPDATE:
          // Updates on every syllable/word as the candidate speaks!
          const liveText = committedTextRef.current
            ? (interimChunk ? `${committedTextRef.current.trim()} ${interimChunk.trim()}` : committedTextRef.current)
            : interimChunk.trim();

          setTranscript(liveText);
          transcriptRef.current = liveText;
        };

        recognition.onerror = (event: { error: string }) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage(
              'Microphone access was denied or blocked by iframe permissions. You can type directly or click "Try Sample Spoken Answer".'
            );
            setIsListening(false);
            isListeningRef.current = false;
            cleanupAudio();
          } else if (event.error === 'no-speech') {
            // In Chrome, candidate simply paused to think; keep listening
          } else if (event.error === 'network') {
            setErrorMessage('Network connection required for speech recognition service.');
            setIsListening(false);
            isListeningRef.current = false;
            cleanupAudio();
          }
        };

        recognition.onend = () => {
          // If candidate paused and speech ended without explicit stop, restart seamlessly
          if (!isExplicitStopRef.current && isListeningRef.current) {
            if (interimTranscriptRef.current) {
              const merged = committedTextRef.current
                ? `${committedTextRef.current.trim()} ${interimTranscriptRef.current.trim()}`
                : interimTranscriptRef.current.trim();
              committedTextRef.current = merged;
              transcriptRef.current = merged;
              setTranscript(merged);
              setInterimTranscript('');
              interimTranscriptRef.current = '';
            }

            try {
              startFreshInstance();
              return;
            } catch {
              // fallback
            }
          }

          setIsListening(false);
          isListeningRef.current = false;
          cleanupAudio();
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (err: unknown) {
        console.warn('SpeechRecognition initialization error:', err);
        setErrorMessage('Could not activate speech recognition. You can type directly or use the sample spoken answer.');
        setIsListening(false);
        isListeningRef.current = false;
        cleanupAudio();
      }
    };

    startFreshInstance();
  }, [cleanupAudio, setupAudioMeter]);

  // Reset transcripts
  const resetTranscript = useCallback(() => {
    committedTextRef.current = '';
    interimTranscriptRef.current = '';
    transcriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Built-in speech simulation for test/demo environments or when mic is disabled/blocked in iframe
  const simulateVoiceInput = useCallback(
    (sampleText: string) => {
      stopListening();
      isListeningRef.current = true;
      setIsListening(true);
      setErrorMessage(null);

      const words = sampleText.split(' ');
      let currentIndex = 0;
      const baseText = committedTextRef.current ? `${committedTextRef.current.trim()} ` : '';

      // Animate simulated volume bouncing
      const volumeInterval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 55) + 35);
      }, 100);

      simulationIntervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          const nextPartial = words.slice(0, currentIndex + 1).join(' ');
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
          setInterimTranscript('');
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
    simulateVoiceInput,
  };
}
