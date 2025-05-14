import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { audioLogger, resumeAudioContext } from '@/utils/audioUtils';

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
  { name: 'A', frequency: 440.00 }, // A440 standard concert pitch
  { name: 'A#', frequency: 466.16 },
  { name: 'B', frequency: 493.88 }
];

interface PitchPipeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function PitchPipe({ 
  size = 'md', 
  className,
  audioContextRef
}: PitchPipeProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);

  // Get or create audio context
  const getAudioContext = (): AudioContext => {
    // Use the provided audio context if available
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    // Otherwise create or use our local audio context
    if (!localAudioContextRef.current) {
      localAudioContextRef.current = new AudioContext();
    }
    
    return localAudioContextRef.current;
  };

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);

  // Play a note
  const playNote = (noteName: string) => {
    try {
      const audioContext = getAudioContext();
      
      // Resume audio context if suspended (needed for mobile browsers)
      if (audioContext.state === 'suspended') {
        resumeAudioContext(audioContext);
      }
      
      // Stop any currently playing note
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      
      // Set up gain node for smooth fade out
      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.value = 0.7; // Set volume
      gainNodeRef.current.connect(audioContext.destination);
      
      // Find the note data
      const note = NOTES.find(n => n.name === noteName);
      if (!note) return;
      
      // Create and configure oscillator
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = 'sine'; // Smooth tone
      oscillatorRef.current.frequency.value = note.frequency;
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      
      // Set active note for UI
      setActiveNote(noteName);
      
      // Schedule automatic note stop after 2 seconds
      setTimeout(() => {
        if (gainNodeRef.current && oscillatorRef.current) {
          // Fade out over 500ms for a smooth ending
          gainNodeRef.current.gain.exponentialRampToValueAtTime(
            0.001, audioContext.currentTime + 0.5
          );
          
          // Stop the oscillator after fade completes
          setTimeout(() => {
            if (oscillatorRef.current) {
              oscillatorRef.current.stop();
              setActiveNote(null);
            }
          }, 500);
        }
      }, 2000);
      
      audioLogger.log(`Playing note: ${noteName} (${note.frequency}Hz)`);
    } catch (error) {
      audioLogger.error('Error playing note:', error);
    }
  };

  // Stop the currently playing note
  const stopNote = () => {
    if (gainNodeRef.current && oscillatorRef.current) {
      const audioContext = getAudioContext();
      
      // Quick fade out
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        0.001, audioContext.currentTime + 0.1
      );
      
      // Stop oscillator after fade
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          setActiveNote(null);
        }
      }, 100);
    }
  };

  // Determine the size class for the note buttons
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'lg': return 'h-14 w-14 text-lg';
      default: return 'h-10 w-10 text-sm';
    }
  };

  // Control which notes to display based on size
  const displayedNotes = size === 'sm' 
    ? ['C', 'E', 'G', 'A'] // Fewer notes for small size
    : NOTES.map(n => n.name);

  return (
    <div className={cn("flex flex-col items-center p-2", className)}>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {displayedNotes.map((note) => (
          <Button
            key={note}
            type="button"
            size="sm"
            variant={activeNote === note ? "default" : "outline"}
            className={cn(
              getSizeClass(),
              "rounded-full flex items-center justify-center transition-colors",
              activeNote === note ? "bg-glee-purple text-white" : "hover:bg-secondary"
            )}
            onClick={() => playNote(note)}
          >
            {note}
          </Button>
        ))}
      </div>
      
      {activeNote && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={stopNote}
          className="text-xs mt-1"
        >
          Stop
        </Button>
      )}
    </div>
  );
}
