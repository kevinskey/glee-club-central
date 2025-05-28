
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { audioLogger } from '@/utils/audioUtils';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

const NOTE_FREQUENCIES: Record<string, number> = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
  'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
};

interface PianoKeyboardProps {
  audioContextRef?: React.RefObject<AudioContext | null>;
  onClose?: () => void;
}

export function PianoKeyboard({ audioContextRef, onClose }: PianoKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.3);
  const [isReady, setIsReady] = useState(false);
  
  const oscillatorsRef = useRef<Map<string, { oscillator: OscillatorNode; gainNode: GainNode }>>(new Map());
  const localAudioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!audioContextRef?.current && !localAudioContextRef.current) {
          localAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const context = audioContextRef?.current || localAudioContextRef.current;
        if (context && context.state === 'suspended') {
          await context.resume();
        }
        
        setIsReady(true);
        audioLogger.log('PianoKeyboard: Audio context initialized');
      } catch (error) {
        audioLogger.error('PianoKeyboard: Failed to initialize audio', error);
      }
    };

    initAudio();
    
    return () => {
      stopAllNotes();
    };
  }, [audioContextRef]);

  const getAudioContext = (): AudioContext | null => {
    return audioContextRef?.current || localAudioContextRef.current;
  };

  const stopAllNotes = useCallback(() => {
    oscillatorsRef.current.forEach(({ oscillator, gainNode }) => {
      try {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // Ignore stop errors
      }
    });
    oscillatorsRef.current.clear();
    setActiveKeys(new Set());
  }, []);

  const playNote = useCallback(async (noteKey: string) => {
    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const frequency = NOTE_FREQUENCIES[noteKey];
      if (!frequency) return;

      // Stop note if already playing
      const existingNote = oscillatorsRef.current.get(noteKey);
      if (existingNote) {
        try {
          existingNote.oscillator.stop();
          existingNote.oscillator.disconnect();
          existingNote.gainNode.disconnect();
        } catch (e) {
          // Ignore stop errors
        }
        oscillatorsRef.current.delete(noteKey);
      }

      // Create new oscillator and gain node
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.connect(audioContext.destination);

      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(gainNode);
      oscillator.start();

      oscillatorsRef.current.set(noteKey, { oscillator, gainNode });
      setActiveKeys(prev => new Set(prev).add(noteKey));

      audioLogger.log(`Playing note: ${noteKey} (${frequency}Hz)`);
    } catch (error) {
      audioLogger.error('Error playing piano note:', error);
    }
  }, [volume]);

  const stopNote = useCallback((noteKey: string) => {
    const note = oscillatorsRef.current.get(noteKey);
    if (!note) return;

    try {
      const { oscillator, gainNode } = note;
      const audioContext = getAudioContext();
      
      if (audioContext) {
        // Fade out
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore stop errors
          }
          oscillatorsRef.current.delete(noteKey);
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(noteKey);
            return newSet;
          });
        }, 110);
      }
    } catch (error) {
      audioLogger.error('Error stopping piano note:', error);
    }
  }, []);

  const renderOctave = (octave: number) => {
    return (
      <div key={octave} className="relative flex">
        {/* White keys */}
        {WHITE_KEYS.map((note, index) => {
          const noteKey = `${note}${octave}`;
          const isActive = activeKeys.has(noteKey);
          
          return (
            <Button
              key={noteKey}
              className={cn(
                "relative w-8 h-24 border border-gray-300 bg-white text-black text-xs font-mono rounded-b-md transition-colors",
                isActive ? "bg-gray-200" : "hover:bg-gray-50"
              )}
              onMouseDown={() => playNote(noteKey)}
              onMouseUp={() => stopNote(noteKey)}
              onMouseLeave={() => stopNote(noteKey)}
              onTouchStart={() => playNote(noteKey)}
              onTouchEnd={() => stopNote(noteKey)}
            >
              {note}
            </Button>
          );
        })}
        
        {/* Black keys */}
        <div className="absolute inset-0 flex">
          {BLACK_KEYS.map((note, index) => {
            if (!note) {
              return <div key={`empty-${index}`} className="w-8" />;
            }
            
            const noteKey = `${note}${octave}`;
            const isActive = activeKeys.has(noteKey);
            const leftOffset = index * 32 + 20; // 32px = white key width, 20px offset
            
            return (
              <Button
                key={noteKey}
                className={cn(
                  "absolute w-5 h-16 bg-gray-800 text-white text-xs font-mono rounded-b-md transition-colors z-10",
                  isActive ? "bg-gray-600" : "hover:bg-gray-700"
                )}
                style={{ left: `${leftOffset}px` }}
                onMouseDown={() => playNote(noteKey)}
                onMouseUp={() => stopNote(noteKey)}
                onMouseLeave={() => stopNote(noteKey)}
                onTouchStart={() => playNote(noteKey)}
                onTouchEnd={() => stopNote(noteKey)}
              >
                {note.replace('#', '♯')}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Initializing audio...</div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Piano Keyboard (3 Octaves)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
          <Slider
            value={[volume * 100]}
            onValueChange={(values) => setVolume(values[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-center overflow-x-auto pb-4">
          <div className="flex space-x-0">
            {[3, 4, 5].map(octave => renderOctave(octave))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={stopAllNotes}>
            Stop All
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
