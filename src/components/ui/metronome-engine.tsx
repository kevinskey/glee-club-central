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
  const normalBuffer = useRef<AudioBuffer | null>(null);
  const accentBuffer = useRef<AudioBuffer | null>(null);
  
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
  
  // Generate audio buffers programmatically
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
        
        // Create sound buffers programmatically
        const ctx = audioContext.current;
        const createClickSound = () => {
          const sampleRate = ctx.sampleRate;
          const duration = 0.05; // 50ms
          const bufferSize = sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Create a short percussive click
          for (let i = 0; i < bufferSize; i++) {
            // Quick decay
            data[i] = (1 - i / bufferSize) * 
                    (Math.random() * 0.2 + 
                    (i < 0.01 * sampleRate ? 0.8 : 0.2)); // Initial spike with noise
          }
          
          return buffer;
        };
        
        const createBeepSound = () => {
          const sampleRate = ctx.sampleRate;
          const duration = 0.08;
          const bufferSize = sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Create a sine wave beep with envelope
          for (let i = 0; i < bufferSize; i++) {
            const t = i / sampleRate;
            // Sine wave at 880Hz
            const wave = Math.sin(2 * Math.PI * 880 * t);
            
            // Apply envelope (attack, decay)
            let envelope;
            if (t < 0.01) { 
              envelope = t / 0.01; // Attack
            } else {
              envelope = 1.0 - ((t - 0.01) / (duration - 0.01)); // Decay
            }
            
            data[i] = wave * envelope;
          }
          
          return buffer;
        };
        
        const createWoodblockSound = () => {
          const sampleRate = ctx.sampleRate;
          const duration = 0.15;
          const bufferSize = sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Create a woodblock-like sound (multiple frequencies with quick decay)
          const frequencies = [800, 1200]; 
          
          for (let i = 0; i < bufferSize; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            // Mix frequencies
            for (const freq of frequencies) {
              sample += Math.sin(2 * Math.PI * freq * t) * Math.exp(-12 * t);
            }
            
            // Add noise at the beginning for attack
            if (t < 0.01) {
              sample += (Math.random() * 2 - 1) * (0.01 - t) / 0.01;
            }
            
            data[i] = sample * 0.5;
          }
          
          return buffer;
        };
        
        // Create buffers based on selected sound type
        switch (soundType) {
          case "beep":
            normalBuffer.current = createBeepSound();
            accentBuffer.current = createBeepSound(); // Same for now, could be modified
            break;
          case "woodblock":
            normalBuffer.current = createWoodblockSound();
            accentBuffer.current = createWoodblockSound(); // Same for now, could be modified
            break;
          case "click":
          default:
            normalBuffer.current = createClickSound();
            accentBuffer.current = createClickSound(); // Same for now, could be modified
            break;
        }
        
        setAudioLoaded(true);
        console.log("✅ Metronome: Audio buffers created successfully");
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
  }, [soundType, audioContextRef, volume]);
  
  // Update sound when sound type changes
  useEffect(() => {
    if (!audioContext.current || !audioLoaded) return;
    
    const ctx = audioContext.current;
    
    // Create sound buffers programmatically based on the selected sound type
    const createClickSound = () => {
      const sampleRate = ctx.sampleRate;
      const duration = 0.05; // 50ms
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create a short percussive click
      for (let i = 0; i < bufferSize; i++) {
        // Quick decay
        data[i] = (1 - i / bufferSize) * 
                (Math.random() * 0.2 + 
                (i < 0.01 * sampleRate ? 0.8 : 0.2)); // Initial spike with noise
      }
      
      return buffer;
    };
    
    const createBeepSound = () => {
      const sampleRate = ctx.sampleRate;
      const duration = 0.08;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create a sine wave beep with envelope
      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate;
        // Sine wave at 880Hz
        const wave = Math.sin(2 * Math.PI * 880 * t);
        
        // Apply envelope (attack, decay)
        let envelope;
        if (t < 0.01) { 
          envelope = t / 0.01; // Attack
        } else {
          envelope = 1.0 - ((t - 0.01) / (duration - 0.01)); // Decay
        }
        
        data[i] = wave * envelope;
      }
      
      return buffer;
    };
    
    const createWoodblockSound = () => {
      const sampleRate = ctx.sampleRate;
      const duration = 0.15;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create a woodblock-like sound (multiple frequencies with quick decay)
      const frequencies = [800, 1200]; 
      
      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // Mix frequencies
        for (const freq of frequencies) {
          sample += Math.sin(2 * Math.PI * freq * t) * Math.exp(-12 * t);
        }
        
        // Add noise at the beginning for attack
        if (t < 0.01) {
          sample += (Math.random() * 2 - 1) * (0.01 - t) / 0.01;
        }
        
        data[i] = sample * 0.5;
      }
      
      return buffer;
    };
    
    // Create buffers based on selected sound type
    switch (soundType) {
      case "beep":
        normalBuffer.current = createBeepSound();
        accentBuffer.current = createBeepSound(); // Same for now, could be modified
        break;
      case "woodblock":
        normalBuffer.current = createWoodblockSound();
        accentBuffer.current = createWoodblockSound(); // Same for now, could be modified
        break;
      case "click":
      default:
        normalBuffer.current = createClickSound();
        accentBuffer.current = createClickSound(); // Same for now, could be modified
        break;
    }
  }, [soundType, audioLoaded]);
  
  // Handle volume changes
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);
  
  // Schedule the next tick and play sound
  const scheduleSound = useCallback((time: number) => {
    if (!audioContext.current || !gainNode.current || !normalBuffer.current || !accentBuffer.current) {
      return;
    }
    
    const isFirstBeat = currentBeat.current === 0 && currentSubBeat.current === 0;
    const isMainBeat = currentSubBeat.current === 0;
    
    const source = audioContext.current.createBufferSource();
    
    // Use accent sound for first beat if accent is enabled
    if (isFirstBeat && accentFirstBeat) {
      source.buffer = accentBuffer.current;
    } else {
      source.buffer = normalBuffer.current;
    }
    
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
  }, [accentFirstBeat, getBeatsPerMeasure, getSubdivisionsPerBeat, onTick]);
  
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
