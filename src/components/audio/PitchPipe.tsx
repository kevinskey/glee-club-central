
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { getNoteFrequency } from '@/utils/audioUtils';

const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

export function PitchPipe() {
  const [audio] = useState(() => new AudioContext());

  const playTone = (note: string) => {
    const freq = getNoteFrequency(note);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    oscillator.connect(gain);
    gain.connect(audio.destination);

    gain.gain.setValueAtTime(0.3, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 1);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Pitch Pipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {notes.map(note => (
            <Button
              key={note}
              onClick={() => playTone(note)}
              variant="outline"
              className="min-w-16"
            >
              {note}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
