
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Safe audio context creation with fallbacks
const createAudioContext = (): AudioContext | null => {
  try {
    if (typeof window === 'undefined' || !window.AudioContext && !(window as any).webkitAudioContext) {
      console.warn('Web Audio API not supported');
      return null;
    }
    
    return new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
      sampleRate: 48000
    });
  } catch (error) {
    console.warn('Failed to create audio context:', error);
    try {
      return new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (fallbackError) {
      console.warn('Failed to create fallback audio context:', fallbackError);
      return null;
    }
  }
};

const playTone = (
  audioContext: AudioContext, 
  frequency: number, 
  waveform: OscillatorType = 'sine',
  duration: number = 0, 
  volume: number = 0.3
): OscillatorNode | null => {
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = waveform;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.start();
    
    if (duration > 0) {
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      setTimeout(() => {
        try {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        } catch (error) {
          console.warn('Error stopping oscillator:', error);
        }
      }, duration * 1000);
    }
    
    return oscillator;
  } catch (error) {
    console.error('Error playing tone:', error);
    return null;
  }
};

const getNoteFrequency = (note: string, octave: number = 4): number => {
  const noteToFrequency: Record<string, number> = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
  };
  
  if (octave === 4) {
    return noteToFrequency[note] || 440;
  }
  
  const baseFreq = noteToFrequency[note] || 440;
  const octaveDiff = octave - 4;
  return baseFreq * Math.pow(2, octaveDiff);
};

export function PitchPipe() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentOscillator, setCurrentOscillator] = useState<OscillatorNode | null>(null);
  const [isAudioSupported, setIsAudioSupported] = useState(true);

  const initializeAudio = async () => {
    try {
      if (!audioContext) {
        const ctx = createAudioContext();
        if (!ctx) {
          setIsAudioSupported(false);
          return false;
        }
        
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        
        setAudioContext(ctx);
        return true;
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setIsAudioSupported(false);
      return false;
    }
  };

  const playNote = async (note: string, octave: number = 4) => {
    try {
      const audioInitialized = await initializeAudio();
      if (!audioInitialized || !audioContext) {
        console.warn('Audio not available');
        return;
      }
      
      if (currentOscillator) {
        try {
          currentOscillator.stop();
        } catch (error) {
          console.warn('Error stopping previous oscillator:', error);
        }
        setCurrentOscillator(null);
      }

      const frequency = getNoteFrequency(note, octave);
      const oscillator = playTone(audioContext, frequency, 'sine', 0, 0.3);
      setCurrentOscillator(oscillator);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const stopNote = () => {
    try {
      if (currentOscillator) {
        currentOscillator.stop();
        setCurrentOscillator(null);
      }
    } catch (error) {
      console.warn('Error stopping note:', error);
    }
  };

  if (!isAudioSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Pitch Pipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Audio not supported in this browser
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Pitch Pipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {notes.map((note) => (
            <Button
              key={note}
              variant="outline"
              className="h-12"
              onMouseDown={() => playNote(note)}
              onMouseUp={stopNote}
              onMouseLeave={stopNote}
              onTouchStart={(e) => {
                e.preventDefault();
                playNote(note);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopNote();
              }}
            >
              {note}
            </Button>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Press and hold buttons to play notes
        </div>
      </CardContent>
    </Card>
  );
}

export default PitchPipe;
