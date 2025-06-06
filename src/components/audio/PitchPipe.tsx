
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music } from 'lucide-react';

// Import audio utility functions
const getNoteFrequency = (note: string, octave: number = 4): number => {
  console.log('getNoteFrequency called with:', { note, octave });
  
  const noteMap: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };
  
  const semitone = noteMap[note];
  if (semitone === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // A4 = 440 Hz
  const A4 = 440;
  const A4_OCTAVE = 4;
  const A4_SEMITONE = 9; // A is the 9th semitone in the chromatic scale
  
  const semitonesFromA4 = (octave - A4_OCTAVE) * 12 + (semitone - A4_SEMITONE);
  const frequency = A4 * Math.pow(2, semitonesFromA4 / 12);
  
  console.log('Calculated frequency:', frequency);
  return frequency;
};

const playNote = (frequency: number, duration: number = 1000): Promise<void> => {
  console.log('playNote called with:', { frequency, duration });
  
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octaves = [2, 3, 4, 5, 6];

export function PitchPipe() {
  const [selectedNote, setSelectedNote] = useState('C');
  const [selectedOctave, setSelectedOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayNote = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      console.log('Playing note:', selectedNote, selectedOctave);
      const frequency = getNoteFrequency(selectedNote, selectedOctave);
      console.log('Calculated frequency:', frequency);
      await playNote(frequency, 2000); // Play for 2 seconds
    } catch (error) {
      console.error('Error playing note:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Pitch Pipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Note</label>
            <Select value={selectedNote} onValueChange={setSelectedNote}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notes.map((note) => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Octave</label>
            <Select value={selectedOctave.toString()} onValueChange={(value) => setSelectedOctave(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {octaves.map((octave) => (
                  <SelectItem key={octave} value={octave.toString()}>
                    {octave}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handlePlayNote} 
          disabled={isPlaying}
          className="w-full"
        >
          {isPlaying ? 'Playing...' : `Play ${selectedNote}${selectedOctave}`}
        </Button>
        
        <div className="text-sm text-muted-foreground text-center">
          Frequency: {getNoteFrequency(selectedNote, selectedOctave).toFixed(2)} Hz
        </div>
      </CardContent>
    </Card>
  );
}
