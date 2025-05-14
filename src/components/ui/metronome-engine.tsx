import { useState, useEffect, useRef, useCallback, MutableRefObject } from "react";

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
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Internal refs
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const nextTickTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const currentBeat = useRef(0);
  const currentSubBeat = useRef(0);
  const audioBuffers = useRef<{ [key: string]: AudioBuffer }>({});
  
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
  
  // Load audio files
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
        
        const ctx = audioContext.current;
        
        // Function to fetch and decode audio
        const loadSoundFile = async (soundName: string, url: string) => {
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            return audioBuffer;
          } catch (error) {
            console.error(`Failed to load sound: ${soundName}`, error);
            throw error;
          }
        };
        
        // Load all the sound files
        Promise.all([
          loadSoundFile('click', '/sounds/click.wav'),
          loadSoundFile('beep', '/sounds/beep.wav'),
          loadSoundFile('woodblock', '/sounds/woodblock.wav'),
        ]).then(([clickBuffer, beepBuffer, woodblockBuffer]) => {
          audioBuffers.current = {
            click: clickBuffer,
            beep: beepBuffer,
            woodblock: woodblockBuffer
          };
          setAudioLoaded(true);
          console.log("✅ Metronome: Audio files loaded successfully");
        }).catch(error => {
          setAudioError("Failed to load audio files. Please check your connection.");
          console.error("Metronome audio loading failed:", error);
        });
        
      } catch (error) {
        console.error("Failed to initialize audio system:", error);
        setAudioError("Your browser doesn't support Web Audio API or it's restricted.");
        setAudioLoaded(false);
      }
    }
    
    return () => {
      if (timerID.current) {
        clearTimeout(timerID.current);
      }
    };
  }, [audioContextRef, volume]);
  
  // Handle volume changes
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);
  
  // Schedule the next tick and play sound
  const scheduleSound = useCallback((time: number) => {
    if (!audioContext.current || !gainNode.current || !audioBuffers.current[soundType]) {
      return;
    }
    
    const isFirstBeat = currentBeat.current === 0 && currentSubBeat.current === 0;
    const isMainBeat = currentSubBeat.current === 0;
    
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffers.current[soundType];
    
    // Adjust volume for subdivisions
    const subVolume = isMainBeat ? 1.0 : 0.75;
    const subGain = audioContext.current.createGain();
    subGain.gain.value = subVolume;
    
    source.connect(subGain);
    subGain.connect(gainNode.current);
    source.start(time);
    
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
  }, [soundType, getBeatsPerMeasure, getSubdivisionsPerBeat, onTick]);
  
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
    if (isPlaying && audioLoaded) {
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
  }, [isPlaying, audioLoaded, scheduler]);
  
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
    audioLoaded,
    audioError,
    resumeAudioSystem,
  };
}
