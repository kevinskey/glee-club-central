
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAdvancedAudio } from '@/hooks/useAdvancedAudio';
import { Volume2 } from 'lucide-react';

const CHROMATIC_NOTES = [
  { name: 'C', frequency: 261.63 },
  { name: 'C#', frequency: 277.18 },
  { name: 'D', frequency: 293.66 },
  { name: 'D#', frequency: 311.13 },
  { name: 'E', frequency: 329.63 },
  { name: 'F', frequency: 349.23 },
  { name: 'F#', frequency: 369.99 },
  { name: 'G', frequency: 392.00 },
  { name: 'G#', frequency: 415.30 },
  { name: 'A', frequency: 440.00 },
  { name: 'A#', frequency: 466.16 },
  { name: 'B', frequency: 493.88 }
];

const OCTAVES = [3, 4, 5];

interface PitchPipeProps {
  onClose?: () => void;
}

export function PitchPipe({ onClose }: PitchPipeProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [selectedOctave, setSelectedOctave] = useState(4);
  const [selectedInstrument, setSelectedInstrument] = useState('acoustic_grand_piano');
  const [volume, setVolume] = useState(70);
  
  const { 
    isInitialized, 
    isLoading, 
    error, 
    playNote, 
    stopNote, 
    stopAllNotes,
    availableInstruments,
    loadInstrument
  } = useAdvancedAudio();

  const handlePlayNote = useCallback(async (noteName: string) => {
    if (!isInitialized) return;
    
    const noteWithOctave = `${noteName}${selectedOctave}`;
    
    try {
      // Stop any currently playing note
      if (activeNote) {
        stopNote(activeNote, selectedInstrument);
      }
      
      // Play the new note
      await playNote(noteWithOctave, Math.round((volume / 100) * 127), 2, selectedInstrument);
      setActiveNote(noteWithOctave);
      
      // Auto-stop after 2 seconds
      setTimeout(() => {
        setActiveNote(null);
      }, 2000);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [isInitialized, activeNote, selectedOctave, selectedInstrument, volume, playNote, stopNote]);

  const handleStopNote = useCallback(() => {
    if (activeNote) {
      stopNote(activeNote, selectedInstrument);
      setActiveNote(null);
    }
  }, [activeNote, selectedInstrument, stopNote]);

  const handleInstrumentChange = useCallback(async (instrumentId: string) => {
    setSelectedInstrument(instrumentId);
    // Preload the instrument
    await loadInstrument(instrumentId);
  }, [loadInstrument]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Initializing advanced audio system...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Audio Error</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Audio system not ready</div>
        </CardContent>
      </Card>
    );
  }

  const voiceInstruments = availableInstruments.filter(inst => 
    inst.category === 'Ensemble' || inst.category === 'Piano' || inst.category === 'Strings'
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Professional Pitch Pipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instrument Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Instrument</label>
          <Select value={selectedInstrument} onValueChange={handleInstrumentChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voiceInstruments.map(instrument => (
                <SelectItem key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Octave Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Octave</label>
          <Select value={selectedOctave.toString()} onValueChange={(value) => setSelectedOctave(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OCTAVES.map(octave => (
                <SelectItem key={octave} value={octave.toString()}>
                  Octave {octave}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Volume: {volume}%
          </label>
          <Slider
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Note Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {CHROMATIC_NOTES.map((note) => {
            const noteWithOctave = `${note.name}${selectedOctave}`;
            const isActive = activeNote === noteWithOctave;
            
            return (
              <Button
                key={note.name}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "h-12 w-full font-mono text-sm transition-all duration-200",
                  isActive ? "bg-primary text-primary-foreground shadow-lg scale-105" : "hover:bg-secondary"
                )}
                onClick={() => handlePlayNote(note.name)}
                disabled={!isInitialized}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{note.name}</span>
                  <span className="text-xs opacity-70">{Math.round(note.frequency)}Hz</span>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Control Buttons */}
        <div className="flex justify-center space-x-2">
          {activeNote && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStopNote}
            >
              Stop
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopAllNotes}
          >
            Stop All
          </Button>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
