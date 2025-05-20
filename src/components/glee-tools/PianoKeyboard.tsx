import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { createAudioContext, resumeAudioContext } from "@/utils/audioUtils";

const PIANO_KEYS = [
  { note: 'C', isSharp: false },
  { note: 'C#', isSharp: true },
  { note: 'D', isSharp: false },
  { note: 'D#', isSharp: true },
  { note: 'E', isSharp: false },
  { note: 'F', isSharp: false },
  { note: 'F#', isSharp: true },
  { note: 'G', isSharp: false },
  { note: 'G#', isSharp: true },
  { note: 'A', isSharp: false },
  { note: 'A#', isSharp: true },
  { note: 'B', isSharp: false }
];

// Pre-calculate frequencies for quick access
const calculateFrequencies = () => {
  const freqMap: Record<string, number[]> = {};
  for (const key of PIANO_KEYS) {
    freqMap[key.note] = [];
    for (let oct = 2; oct <= 6; oct++) {
      // Calculate frequency: C4 (middle C) = 261.63 Hz
      const baseFreq = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      }[key.note];
      
      freqMap[key.note][oct] = baseFreq * Math.pow(2, oct - 4);
    }
  }
  return freqMap;
};

const NOTE_FREQUENCIES = calculateFrequencies();

interface PianoKeyboardProps {
  onClose?: () => void;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function PianoKeyboard({ onClose, audioContextRef }: PianoKeyboardProps) {
  const [octave, setOctave] = useState(4);
  const [volume, setVolume] = useState(0.7);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, { oscillator: OscillatorNode, gain: GainNode }>>(new Map());
  
  // Get or create audio context
  const getAudioContext = (): AudioContext => {
    // Use the provided audio context if available
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    // Otherwise create or use our local audio context
    if (!localAudioContextRef.current) {
      localAudioContextRef.current = createAudioContext();
    }
    
    return localAudioContextRef.current;
  };
  
  // Initialize audio context with low latency options
  useEffect(() => {
    // Initialize only if we're using the local context
    if (!audioContextRef?.current) {
      localAudioContextRef.current = createAudioContext();
      
      // Optimize audio context for low latency
      if (localAudioContextRef.current && 'audioWorklet' in localAudioContextRef.current) {
        localAudioContextRef.current.resume().catch(console.error);
      }
    }
    
    return () => {
      // Clean up oscillators
      oscillatorsRef.current.forEach((nodes) => {
        try {
          nodes.oscillator.stop();
          nodes.oscillator.disconnect();
          nodes.gain.disconnect();
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      
      // Close audio context only if it's our local one
      if (!audioContextRef && localAudioContextRef.current && localAudioContextRef.current.state !== 'closed') {
        localAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioContextRef]);
  
  // Play piano note with optimized handling
  const playNote = (note: string) => {
    const ctx = getAudioContext();
    
    // Resume context if suspended (needed for mobile)
    if (ctx.state === 'suspended') {
      resumeAudioContext(ctx).catch(console.error);
    }
    
    const noteKey = `${note}-${octave}`;
    
    // Stop any existing note
    stopNote(noteKey);
    
    // Create optimized oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Set note frequency directly from pre-calculated table
    osc.frequency.value = NOTE_FREQUENCIES[note][octave];
    osc.type = 'sine';
    
    // Use more immediate envelope for faster response
    gain.gain.value = volume;
    
    // Connect nodes and play immediately
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Start immediately
    osc.start();
    
    // Store references for cleanup
    oscillatorsRef.current.set(noteKey, { oscillator: osc, gain });
    
    // Schedule release in 1 second
    setTimeout(() => {
      stopNote(noteKey);
    }, 1000);
  };
  
  // Stop a specific note
  const stopNote = (noteKey: string) => {
    const nodes = oscillatorsRef.current.get(noteKey);
    if (nodes) {
      try {
        const { oscillator, gain } = nodes;
        
        // Quick fade out to avoid clicks
        const ctx = getAudioContext();
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
        
        // Stop after fade out
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
          } catch (e) {
            // Ignore stop errors
          }
        }, 35);
        
        oscillatorsRef.current.delete(noteKey);
      } catch (e) {
        console.error('Error stopping note:', e);
      }
    }
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Piano Keyboard</h3>
      </div>
      
      {/* Piano Keyboard */}
      <div className="relative h-32 sm:h-40 overflow-hidden flex">
        {PIANO_KEYS.map((key, idx) => {
          if (!key.isSharp) {
            return (
              <button
                key={`${key.note}-${octave}`}
                className="flex-1 bg-white border border-gray-300 rounded-b hover:bg-gray-100 active:bg-gray-200 relative flex flex-col-reverse"
                onMouseDown={() => playNote(key.note)}
                onTouchStart={() => playNote(key.note)}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {key.note}
                </span>
              </button>
            );
          }
          return null;
        })}
        
        {/* Black keys */}
        <div className="absolute top-0 left-0 w-full h-3/5 flex">
          <div className="w-1/12 flex-shrink-0"></div> {/* C */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onMouseDown={() => playNote('C#')}
            onTouchStart={() => playNote('C#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* D */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onMouseDown={() => playNote('D#')}
            onTouchStart={() => playNote('D#')}
          />
          <div className="w-1/12 flex-shrink-0"></div>
          <div className="w-1/12 flex-shrink-0"></div> {/* Skip E to F */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onMouseDown={() => playNote('F#')}
            onTouchStart={() => playNote('F#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* G */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onMouseDown={() => playNote('G#')}
            onTouchStart={() => playNote('G#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* A */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onMouseDown={() => playNote('A#')}
            onTouchStart={() => playNote('A#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* B */}
        </div>
      </div>
      
      {/* Octave control */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOctave(Math.max(2, octave - 1))}
          disabled={octave <= 2}
        >
          -
        </Button>
        <span className="min-w-8 text-center">Octave: {octave}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOctave(Math.min(6, octave + 1))}
          disabled={octave >= 6}
        >
          +
        </Button>
      </div>
      
      {/* Volume control */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label>Volume</Label>
          <span className="text-xs">{Math.round(volume * 100)}%</span>
        </div>
        <Slider 
          value={[volume]} 
          min={0} 
          max={1} 
          step={0.01}
          onValueChange={(values) => setVolume(values[0])}
        />
      </div>
    </div>
  );
}
