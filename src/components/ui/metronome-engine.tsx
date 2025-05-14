import { useState, useEffect, useRef, useCallback, MutableRefObject } from "react";
import { audioLogger } from "@/utils/audioUtils";

export type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";
export type Subdivision = "quarter" | "eighth" | "triplet" | "sixteenth";
export type SoundType = "click" | "beep" | "woodblock";

interface MetronomeEngineOptions {
  bpm: number;
  isPlaying: boolean;
  volume: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
  subdivision: Subdivision;
  accentFirstBeat?: boolean;
  onTick?: (beat: number, subBeat: number) => void;
  audioContextRef?: MutableRefObject<AudioContext | null>;
}

export function useMetronomeEngine({
  bpm,
  isPlaying,
  volume,
  timeSignature,
  soundType,
  subdivision,
  accentFirstBeat = true,
  onTick,
  audioContextRef,
}: MetronomeEngineOptions) {
  const [audioReady, setAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Internal refs
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const nextTickTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const currentBeat = useRef(0);
  const currentSubBeat = useRef(0);
  
  // Calculate beats based on time signature
  const getBeatsPerMeasure = useCallback(() => {
    return parseInt(timeSignature.split('/')[0]);
  }, [timeSignature]);
  
  // Calculate subdivisions per beat
  const getSubdivisionsPerBeat = useCallback(() => {
    switch (subdivision) {
      case "quarter": return 1;
      case "eighth": return 2;
      case "triplet": return 3;
      case "sixteenth": return 4;
      default: return 1;
    }
  }, [subdivision]);
  
  // Initialize audio system
  useEffect(() => {
    if (!audioContext.current) {
      try {
        audioContext.current = new AudioContext();
        
        // If we received an external reference, populate it
        if (audioContextRef) {
          audioContextRef.current = audioContext.current;
        }
        
        gainNode.current = audioContext.current.createGain();
        gainNode.current.gain.value = volume;
        gainNode.current.connect(audioContext.current.destination);
        
        setAudioReady(true);
        audioLogger.log("Metronome engine: Audio context initialized");
        
      } catch (error) {
        console.error("Failed to initialize audio system:", error);
        setAudioError("Your browser doesn't support Web Audio API or it's restricted.");
        setAudioReady(false);
      }
    }
    
    return () => {
      if (timerID.current) {
        window.clearTimeout(timerID.current);
      }
    };
  }, [audioContextRef, volume]);
  
  // Handle volume changes
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);
  
  // Create and play a sound
  const createSound = (time: number, isAccented: boolean): void => {
    if (!audioContext.current || !gainNode.current) return;

    try {
      // Create oscillator for the sound
      const oscillator = audioContext.current.createOscillator();
      const soundGain = audioContext.current.createGain();
      
      // Configure sound based on type
      switch (soundType) {
        case "click":
          oscillator.type = "square";
          oscillator.frequency.value = isAccented ? 1800 : 1600;
          // Short click sound with quick attack and release
          soundGain.gain.setValueAtTime(0, time);
          soundGain.gain.linearRampToValueAtTime(isAccented ? 1.0 : 0.7, time + 0.001);
          soundGain.gain.linearRampToValueAtTime(0, time + 0.05);
          break;
          
        case "beep":
          oscillator.type = "sine";
          oscillator.frequency.value = isAccented ? 880 : 660;
          // Slightly longer beep with softer attack
          soundGain.gain.setValueAtTime(0, time);
          soundGain.gain.linearRampToValueAtTime(isAccented ? 0.9 : 0.6, time + 0.005);
          soundGain.gain.linearRampToValueAtTime(0, time + 0.1);
          break;
          
        case "woodblock":
          oscillator.type = "triangle";
          oscillator.frequency.value = isAccented ? 1200 : 900;
          // Woodblock-like sound
          soundGain.gain.setValueAtTime(0, time);
          soundGain.gain.linearRampToValueAtTime(isAccented ? 1.0 : 0.6, time + 0.002);
          soundGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
          soundGain.gain.linearRampToValueAtTime(0, time + 0.09);
          break;
      }
      
      // Connect and start
      oscillator.connect(soundGain);
      soundGain.connect(gainNode.current);
      
      oscillator.start(time);
      oscillator.stop(time + 0.1);
      
      // Auto-disconnect after sound finishes
      setTimeout(() => {
        soundGain.disconnect();
        oscillator.disconnect();
      }, (time - audioContext.current!.currentTime + 0.2) * 1000);
      
    } catch (error) {
      console.error("Error creating metronome sound:", error);
    }
  };
  
  // Schedule the next tick and play sound
  const scheduleSound = useCallback((time: number) => {
    if (!audioContext.current || !gainNode.current) {
      return;
    }
    
    const isFirstBeat = currentBeat.current === 0 && currentSubBeat.current === 0;
    const isMainBeat = currentSubBeat.current === 0;
    
    // Create appropriate sound
    createSound(time, isFirstBeat && accentFirstBeat);
    
    if (onTick) {
      onTick(currentBeat.current, currentSubBeat.current);
    }
    
    // Update beat counters
    currentSubBeat.current++;
    const subPerBeat = getSubdivisionsPerBeat();
    if (currentSubBeat.current >= subPerBeat) {
      currentSubBeat.current = 0;
      currentBeat.current = (currentBeat.current + 1) % getBeatsPerMeasure();
    }
  }, [soundType, getBeatsPerMeasure, getSubdivisionsPerBeat, onTick, accentFirstBeat]);
  
  // Scheduler loop that keeps the metronome accurate
  const scheduler = useCallback(() => {
    if (!isPlaying || !audioContext.current) return;
    
    // Look ahead by 100ms to schedule sounds
    const lookAheadMs = 100;
    const scheduleAheadTime = 0.1; // seconds
    
    while (nextTickTime.current < audioContext.current.currentTime + scheduleAheadTime) {
      scheduleSound(nextTickTime.current);
      
      // Calculate time between ticks based on BPM and subdivision
      const subPerBeat = getSubdivisionsPerBeat();
      const secondsPerBeat = 60.0 / bpm;
      const secondsPerTick = secondsPerBeat / subPerBeat;
      
      nextTickTime.current += secondsPerTick;
    }
    
    timerID.current = window.setTimeout(scheduler, lookAheadMs);
  }, [bpm, getSubdivisionsPerBeat, isPlaying, scheduleSound]);
  
  // Start or stop the metronome based on isPlaying
  useEffect(() => {
    if (isPlaying && audioReady) {
      // Resume audio context if it was suspended (browser policy)
      if (audioContext.current && audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      
      // Initialize time for first tick
      if (audioContext.current) {
        nextTickTime.current = audioContext.current.currentTime;
      }
      
      // Reset beat counters
      currentBeat.current = 0;
      currentSubBeat.current = 0;
      
      // Start the scheduler
      scheduler();
    } else {
      // Stop the scheduler
      if (timerID.current) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
    }
    
    return () => {
      if (timerID.current) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
    };
  }, [isPlaying, audioReady, scheduler]);
  
  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (timerID.current) {
        clearTimeout(timerID.current);
      }
      
      // Don't close audioContext if an external ref holds it
      if (!audioContextRef && audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close().catch(console.error);
      }
    };
  }, [audioContextRef]);
  
  // Function to resume audio system (useful for mobile)
  const resumeAudioSystem = useCallback(() => {
    if (audioContext.current && audioContext.current.state === 'suspended') {
      audioContext.current.resume().catch(console.error);
      return true;
    }
    return false;
  }, []);
  
  return {
    audioLoaded: audioReady,
    audioError,
    resumeAudioSystem,
  };
}
