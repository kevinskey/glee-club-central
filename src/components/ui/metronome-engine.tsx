
import { useRef, useState, useCallback, useEffect } from 'react';
import { audioLogger, resumeAudioContext, initializeAudioContext, unlockAudioOnMobile } from '@/utils/audioUtils';
import { toast } from 'sonner';

export type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";
export type Subdivision = "quarter" | "eighth" | "triplet" | "sixteenth";

interface MetronomeEngineProps {
  bpm: number;
  isPlaying: boolean;
  volume: number;
  timeSignature: TimeSignature;
  soundType: string;
  subdivision: Subdivision;
  accentFirstBeat: boolean;
  onTick?: (beat: number, subBeat: number) => void;
}

export function useMetronomeEngine({
  bpm,
  isPlaying,
  volume,
  timeSignature,
  soundType,
  subdivision,
  accentFirstBeat,
  onTick,
}: MetronomeEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<{[key: string]: AudioBuffer}>({});
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const subBeatCountRef = useRef(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Get beats per measure based on time signature
  const getBeatsPerMeasure = useCallback(() => {
    return parseInt(timeSignature.split('/')[0]);
  }, [timeSignature]);

  // Get subdivisions per beat
  const getSubdivisionsPerBeat = useCallback(() => {
    switch (subdivision) {
      case "quarter": return 1;
      case "eighth": return 2;
      case "triplet": return 3;
      case "sixteenth": return 4;
      default: return 1;
    }
  }, [subdivision]);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      if (!audioContextRef.current) {
        window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        audioLogger.log('MetronomeEngine: Audio context created');
        
        if (audioContextRef.current.state === 'suspended') {
          audioLogger.warn('MetronomeEngine: Audio context is suspended. Will resume on user interaction.');
        }
      }
      return audioContextRef.current;
    } catch (error) {
      const errorMessage = "Unable to initialize audio system. Your browser may not support Web Audio API.";
      audioLogger.error("MetronomeEngine: Failed to create audio context:", error);
      setAudioError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Generate sound buffers
  useEffect(() => {
    let isMounted = true;
    const audioContext = initAudioContext();
    
    if (!audioContext) return;

    const createClickBuffer = () => {
      const sampleRate = audioContext.sampleRate;
      const duration = 0.05; // 50ms
      const bufferSize = sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (1 - i / bufferSize) * 
                  (Math.random() * 0.3 - 0.15 + 
                  (i < 0.01 * sampleRate ? 0.8 : 0.2));
      }
      
      return buffer;
    };

    const createAccentedClickBuffer = () => {
      const sampleRate = audioContext.sampleRate;
      const duration = 0.05; // 50ms
      const bufferSize = sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (1 - i / bufferSize) * 
                  (Math.random() * 0.4 - 0.2 + 
                  (i < 0.01 * sampleRate ? 1.0 : 0.3));
      }
      
      return buffer;
    };

    const createSubdivisionClickBuffer = () => {
      const sampleRate = audioContext.sampleRate;
      const duration = 0.03; // 30ms - shorter for subdivisions
      const bufferSize = sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (1 - i / bufferSize) * 
                  (Math.random() * 0.2 - 0.1 + 
                  (i < 0.01 * sampleRate ? 0.5 : 0.1));
      }
      
      return buffer;
    };
    
    const createBuffers = () => {
      try {
        audioBuffersRef.current = {
          click: createClickBuffer(),
          accentedClick: createAccentedClickBuffer(),
          subdivisionClick: createSubdivisionClickBuffer()
        };
        
        if (isMounted) {
          setAudioLoaded(true);
          setAudioError(null);
          audioLogger.log("✅ MetronomeEngine: Sound buffers generated successfully");
        }
      } catch (error) {
        const errorMessage = "Failed to generate metronome sounds. Please refresh the page.";
        audioLogger.error("MetronomeEngine: Failed to generate sounds:", error);
        if (isMounted) {
          setAudioError(errorMessage);
          toast.error(errorMessage);
        }
      }
    };
    
    createBuffers();
    
    return () => {
      isMounted = false;
    };
  }, [initAudioContext]);

  // Play sound
  const playSound = useCallback((soundName: "click" | "accentedClick" | "subdivisionClick") => {
    const audioContext = audioContextRef.current;
    if (!audioContext) {
      return;
    }
    
    // Check if audio context is suspended and try to resume it
    if (audioContext.state === 'suspended') {
      resumeAudioContext(audioContext)
        .then(success => {
          if (success) {
            // Try playing again after resume
            setTimeout(() => playSound(soundName), 10);
          } else {
            audioLogger.error("MetronomeEngine: Could not resume audio context");
          }
        })
        .catch(error => {
          audioLogger.error("MetronomeEngine: Error resuming audio context:", error);
        });
      return;
    }
    
    // Get the sound buffer
    const buffer = audioBuffersRef.current[soundName];
    if (!buffer) {
      audioLogger.error(`MetronomeEngine: Sound buffer not found for: ${soundName}`);
      return;
    }
    
    try {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      source.start(0);
    } catch (error) {
      audioLogger.error("MetronomeEngine: Error playing sound:", error);
    }
  }, [volume]);

  // Start/stop metronome
  useEffect(() => {
    if (!audioLoaded) return;
    
    const audioContext = audioContextRef.current;
    
    const startMetronome = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      
      beatCountRef.current = 0;
      subBeatCountRef.current = 0;
      
      const beatsPerMeasure = getBeatsPerMeasure();
      const subdivisionsPerBeat = getSubdivisionsPerBeat();
      const intervalMs = (60 / bpm / subdivisionsPerBeat) * 1000;
      
      // Resume audio context if needed
      if (audioContext && audioContext.state === 'suspended') {
        resumeAudioContext(audioContext).catch(err => {
          audioLogger.error("MetronomeEngine: Failed to resume audio context:", err);
          toast.error("Could not start audio playback. Please try clicking the start button again.");
        });
      }
      
      audioLogger.log(`MetronomeEngine: Starting at ${bpm} BPM, ${subdivisionsPerBeat} subdivisions`);
      
      timerRef.current = window.setInterval(() => {
        const isFirstBeatOfMeasure = beatCountRef.current === 0 && subBeatCountRef.current === 0;
        const isFirstSubdivisionOfBeat = subBeatCountRef.current === 0;
        
        // Play the appropriate sound
        if (isFirstBeatOfMeasure && accentFirstBeat) {
          playSound("accentedClick");
        } else if (isFirstSubdivisionOfBeat) {
          playSound("click");
        } else {
          playSound("subdivisionClick");
        }
        
        if (onTick) {
          onTick(beatCountRef.current, subBeatCountRef.current);
        }
        
        // Update counters
        subBeatCountRef.current = (subBeatCountRef.current + 1) % subdivisionsPerBeat;
        if (subBeatCountRef.current === 0) {
          beatCountRef.current = (beatCountRef.current + 1) % beatsPerMeasure;
        }
      }, intervalMs);
    };
    
    if (isPlaying) {
      startMetronome();
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isPlaying, 
    bpm, 
    audioLoaded, 
    timeSignature, 
    subdivision,
    accentFirstBeat, 
    playSound, 
    getBeatsPerMeasure, 
    getSubdivisionsPerBeat,
    onTick
  ]);
  
  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Initialize or resume audio context
  const resumeAudioContext = useCallback(() => {
    const audioContext = audioContextRef.current || initAudioContext();
    
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
        .then(() => {
          audioLogger.log("MetronomeEngine: Audio context resumed successfully");
          // Unlock audio on mobile devices
          unlockAudioOnMobile(audioContext);
        })
        .catch(err => {
          audioLogger.error("MetronomeEngine: Failed to resume audio context:", err);
          toast.error("Could not enable audio. Please check your browser permissions.");
        });
    }
    
    return !!audioContext;
  }, [initAudioContext]);

  return {
    audioLoaded,
    audioError,
    resumeAudioContext
  };
}
