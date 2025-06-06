
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX } from 'lucide-react';
import { getNoteFrequency, playNote } from '@/utils/audioUtils';

const NOTES = [
  { note: 'C4', label: 'Do' },
  { note: 'D4', label: 'Re' },
  { note: 'E4', label: 'Mi' },
  { note: 'F4', label: 'Fa' },
  { note: 'G4', label: 'Sol' },
  { note: 'A4', label: 'La' },
  { note: 'B4', label: 'Ti' },
  { note: 'C5', label: 'Do (8va)' }
];

export function PitchPipe() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const handlePlayNote = async (note: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setActiveNote(note);
    
    try {
      await playNote(note, 2000);
    } catch (error) {
      console.error('Error playing note:', error);
    } finally {
      setIsPlaying(false);
      setActiveNote(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Digital Pitch Pipe
        </CardTitle>
        <CardDescription>
          Click any note to hear the pitch. Perfect for warming up or finding your starting note.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NOTES.map(({ note, label }) => (
            <Button
              key={note}
              variant={activeNote === note ? "default" : "outline"}
              className="h-16 flex flex-col items-center justify-center relative"
              onClick={() => handlePlayNote(note)}
              disabled={isPlaying}
            >
              <span className="font-semibold">{note}</span>
              <span className="text-xs opacity-75">{label}</span>
              {activeNote === note && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                  Playing
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        {isPlaying && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <VolumeX className="h-4 w-4 animate-pulse" />
              Playing {activeNote}...
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Usage Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use headphones for better pitch accuracy</li>
            <li>• Start with middle C (C4) for reference</li>
            <li>• Each note plays for 2 seconds</li>
            <li>• Works best in quiet environments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
