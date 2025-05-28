
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { audioLogger } from '@/utils/audioUtils';

// Notes with their frequencies in Hz
const NOTES = [
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

interface PitchPipeProps {
  audioContextRef?: React.RefObject<AudioContext | null>;
  onClose?: () => void;
}

export function PitchPipe({ audioContextRef, onClose }: PitchPipeProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context when component mounts
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
        audioLogger.log('PitchPipe: Audio context initialized');
      } catch (error) {
        audioLogger.error('PitchPipe: Failed to initialize audio', error);
      }
    };

    initAudio();
    
    return () => {
      stopCurrentNote();
    };
  }, [audioContextRef]);

  const getAudioContext = (): AudioContext | null => {
    return audioContextRef?.current || localAudioContextRef.current;
  };

  const stopCurrentNote = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      } catch (e) {
        // Ignore stop errors
      }
    }
    
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      } catch (e) {
        // Ignore disconnect errors
      }
    }
    
    setActiveNote(null);
  };

  const playNote = async (noteName: string) => {
    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      // Resume audio context if needed
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Stop any currently playing note
      stopCurrentNote();

      // Find the note data
      const note = NOTES.find(n => n.name === noteName);
      if (!note) return;

      // Create gain node
      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.value = 0.5;
      gainNodeRef.current.connect(audioContext.destination);

      // Create oscillator
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = note.frequency;
      oscillatorRef.current.connect(gainNodeRef.current);

      // Start the oscillator
      oscillatorRef.current.start();
      setActiveNote(noteName);

      // Set up auto-stop after 2 seconds
      setTimeout(() => {
        if (gainNodeRef.current && oscillatorRef.current) {
          const now = audioContext.currentTime;
          gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
          gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          
          setTimeout(() => {
            stopCurrentNote();
          }, 110);
        }
      }, 2000);

      audioLogger.log(`Playing note: ${noteName} (${note.frequency}Hz)`);
    } catch (error) {
      audioLogger.error('Error playing note:', error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Initializing audio...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {NOTES.map((note) => (
          <Button
            key={note.name}
            type="button"
            size="sm"
            variant={activeNote === note.name ? "default" : "outline"}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
              activeNote === note.name ? "bg-glee-purple text-white" : "hover:bg-secondary"
            )}
            onClick={() => playNote(note.name)}
          >
            {note.name}
          </Button>
        ))}
      </div>
      
      {activeNote && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={stopCurrentNote}
          className="text-xs"
        >
          Stop
        </Button>
      )}
      
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="mt-2 text-xs"
        >
          Close
        </Button>
      )}
    </div>
  );
}
