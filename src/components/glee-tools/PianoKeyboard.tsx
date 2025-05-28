
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Volume2, Keyboard } from 'lucide-react';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const OCTAVES = [2, 3, 4, 5, 6];

interface PianoKeyboardProps {
  onClose?: () => void;
}

export function PianoKeyboard({ onClose }: PianoKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(80);
  const [startOctave, setStartOctave] = useState(3);
  const [octaveCount, setOctaveCount] = useState(3);

  const getFrequency = (note: string, octave: number) => {
    const noteFrequencies: { [key: string]: number } = {
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
    
    const baseFreq = noteFrequencies[note];
    return baseFreq * Math.pow(2, octave - 4);
  };

  const playNote = useCallback((note: string, octave: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(getFrequency(note, octave), audioContext.currentTime);
      oscillator.type = 'sine';
      
      const vol = (volume / 100) * 0.3;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(vol, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      const noteKey = `${note}${octave}`;
      setActiveKeys(prev => new Set(prev).add(noteKey));
      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
      }, 200);

      oscillator.onended = () => {
        audioContext.close();
      };
    } catch (error) {
      console.error('Audio error:', error);
    }
  }, [volume]);

  const renderOctave = useCallback((octave: number) => {
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
                "relative w-10 h-32 border border-gray-300 bg-white text-black text-xs font-mono rounded-b-md transition-all duration-100 shadow-sm",
                isActive ? "bg-gray-200 shadow-inner scale-95" : "hover:bg-gray-50 active:bg-gray-200"
              )}
              onMouseDown={() => playNote(note, octave)}
              onTouchStart={(e) => {
                e.preventDefault();
                playNote(note, octave);
              }}
            >
              <div className="absolute bottom-2 text-center w-full">
                <div className="font-semibold">{note}</div>
                <div className="text-xs opacity-60">{octave}</div>
              </div>
            </Button>
          );
        })}
        
        {/* Black keys */}
        <div className="absolute inset-0 flex">
          {BLACK_KEYS.map((note, index) => {
            if (!note) {
              return <div key={`empty-${index}`} className="w-10" />;
            }
            
            const noteKey = `${note}${octave}`;
            const isActive = activeKeys.has(noteKey);
            const leftOffset = index * 40 + 25; // 40px = white key width, 25px offset
            
            return (
              <Button
                key={noteKey}
                className={cn(
                  "absolute w-6 h-20 bg-gray-900 text-white text-xs font-mono rounded-b-md transition-all duration-100 z-10 shadow-md",
                  isActive ? "bg-gray-600 shadow-inner scale-95" : "hover:bg-gray-700 active:bg-gray-600"
                )}
                style={{ left: `${leftOffset}px` }}
                onMouseDown={() => playNote(note, octave)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  playNote(note, octave);
                }}
              >
                <div className="absolute bottom-1 text-center w-full">
                  <div className="text-xs">{note.replace('#', '♯')}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }, [activeKeys, playNote]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Keyboard className="h-5 w-5" />
          Piano Keyboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm font-medium">Volume:</span>
            <div className="w-24">
              <Slider
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <span className="text-sm text-muted-foreground">{volume}%</span>
          </div>
        </div>
        
        {/* Piano Keyboard */}
        <div className="flex justify-center overflow-x-auto pb-4">
          <div className="flex space-x-0 p-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-inner">
            {Array.from({ length: octaveCount }, (_, i) => startOctave + i).map(octave => 
              renderOctave(octave)
            )}
          </div>
        </div>
        
        {/* Close Button */}
        {onClose && (
          <div className="flex justify-center pt-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
