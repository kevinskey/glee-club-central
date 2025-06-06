
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNoteFrequency, playNote } from '@/utils/audioUtils';
import { Music } from 'lucide-react';

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
      const frequency = getNoteFrequency(selectedNote, selectedOctave);
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
