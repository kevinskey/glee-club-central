
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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

interface PianoKeyboardProps {
  onClose?: () => void;
}

export function PianoKeyboard({ onClose }: PianoKeyboardProps) {
  const [octave, setOctave] = useState(4);
  const [volume, setVolume] = useState(0.7);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error("Failed to create audio context:", error);
      }
    }
    return audioContextRef.current;
  };
  
  // Play piano note
  const playNote = (note: string) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }
    
    // Create oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Set note frequency based on note name and octave
    const frequencies: Record<string, number> = {
      'C': 261.63 * Math.pow(2, octave - 4),
      'C#': 277.18 * Math.pow(2, octave - 4),
      'D': 293.66 * Math.pow(2, octave - 4),
      'D#': 311.13 * Math.pow(2, octave - 4),
      'E': 329.63 * Math.pow(2, octave - 4),
      'F': 349.23 * Math.pow(2, octave - 4),
      'F#': 369.99 * Math.pow(2, octave - 4),
      'G': 392.00 * Math.pow(2, octave - 4),
      'G#': 415.30 * Math.pow(2, octave - 4),
      'A': 440.00 * Math.pow(2, octave - 4),
      'A#': 466.16 * Math.pow(2, octave - 4),
      'B': 493.88 * Math.pow(2, octave - 4)
    };
    
    osc.frequency.value = frequencies[note];
    osc.type = 'sine';
    
    // Configure envelope
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    
    // Connect nodes and play
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

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
                onClick={() => playNote(key.note)}
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
            onClick={() => playNote('C#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* D */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('D#')}
          />
          <div className="w-1/12 flex-shrink-0"></div>
          <div className="w-1/12 flex-shrink-0"></div> {/* Skip E to F */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('F#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* G */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('G#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* A */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('A#')}
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
