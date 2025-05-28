
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { SimpleAudioEngine } from './SimpleAudioEngine';

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

interface SimplePitchPipeProps {
  onClose?: () => void;
}

export function SimplePitchPipe({ onClose }: SimplePitchPipeProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [selectedOctave, setSelectedOctave] = useState(4);
  const [volume, setVolume] = useState(70);
  const [isReady, setIsReady] = useState(false);
  
  const audioEngineRef = useRef<SimpleAudioEngine | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio system
  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Resume if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        audioEngineRef.current = new SimpleAudioEngine(audioContextRef.current);
        setIsReady(true);
        console.log('Simple pitch pipe initialized');
      } catch (error) {
        console.error('Failed to initialize simple pitch pipe:', error);
      }
    };

    initAudio();

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayNote = useCallback(async (noteName: string) => {
    if (!isReady || !audioEngineRef.current || !audioContextRef.current) return;
    
    try {
      // Resume audio context if needed
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const note = CHROMATIC_NOTES.find(n => n.name === noteName);
      if (!note) return;

      // Calculate frequency for the selected octave
      const octaveMultiplier = Math.pow(2, selectedOctave - 4);
      const frequency = note.frequency * octaveMultiplier;
      
      // Play the note
      audioEngineRef.current.playTone(frequency, 2, (volume / 100) * 0.5);
      
      setActiveNote(noteName);
      
      // Auto-stop indicator after 2 seconds
      setTimeout(() => {
        setActiveNote(null);
      }, 2000);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [isReady, selectedOctave, volume]);

  const handleStopNote = useCallback(() => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stopAll();
      setActiveNote(null);
    }
  }, []);

  if (!isReady) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Initializing pitch pipe...</div>
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
      <CardContent className="space-y-6">
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
            const isActive = activeNote === note.name;
            
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
            onClick={handleStopNote}
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
