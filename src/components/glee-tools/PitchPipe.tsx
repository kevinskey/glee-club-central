
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAudioContext, playTone, getNoteFrequency } from '@/utils/audioUtils';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function PitchPipe() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentOscillator, setCurrentOscillator] = useState<OscillatorNode | null>(null);

  const initializeAudio = async () => {
    if (!audioContext) {
      const ctx = createAudioContext();
      await ctx.resume();
      setAudioContext(ctx);
    }
  };

  const playNote = async (note: string, octave: number = 4) => {
    await initializeAudio();
    
    if (currentOscillator) {
      currentOscillator.stop();
      setCurrentOscillator(null);
    }

    if (audioContext) {
      const frequency = getNoteFrequency(note, octave);
      const oscillator = playTone(audioContext, frequency, 'sine', 0, 0.3);
      setCurrentOscillator(oscillator);
    }
  };

  const stopNote = () => {
    if (currentOscillator) {
      currentOscillator.stop();
      setCurrentOscillator(null);
    }
  };

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
              onTouchStart={() => playNote(note)}
              onTouchEnd={stopNote}
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
