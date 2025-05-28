
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

const NOTES = [
  { name: 'C', freq: 261.63 },
  { name: 'C#', freq: 277.18 },
  { name: 'D', freq: 293.66 },
  { name: 'D#', freq: 311.13 },
  { name: 'E', freq: 329.63 },
  { name: 'F', freq: 349.23 },
  { name: 'F#', freq: 369.99 },
  { name: 'G', freq: 392.00 },
  { name: 'G#', freq: 415.30 },
  { name: 'A', freq: 440.00 },
  { name: 'A#', freq: 466.16 },
  { name: 'B', freq: 493.88 }
];

interface BasicPitchPipeProps {
  onClose?: () => void;
}

export function BasicPitchPipe({ onClose }: BasicPitchPipeProps) {
  const [playing, setPlaying] = useState<string | null>(null);

  const playNote = (note: { name: string; freq: number }) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      setPlaying(note.name);
      setTimeout(() => setPlaying(null), 1000);

      // Clean up
      oscillator.onended = () => {
        audioContext.close();
      };
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Music className="h-5 w-5" />
          Pitch Pipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {NOTES.map((note) => (
            <Button
              key={note.name}
              variant={playing === note.name ? "default" : "outline"}
              size="sm"
              onClick={() => playNote(note)}
              className="h-12 font-mono"
            >
              {note.name}
            </Button>
          ))}
        </div>
        {onClose && (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
