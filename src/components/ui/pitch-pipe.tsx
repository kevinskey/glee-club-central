import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { audioLogger, resumeAudioContext, playTone } from '@/utils/audioUtils';

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
      localAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return localAudioContextRef.current;
  };

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      
      if (gainNodeRef.current) {
        try {
          gainNodeRef.current.disconnect();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Play a note
  const playNote = (noteName: string) => {
    try {
      const audioContext = getAudioContext();
      
      // Resume audio context if suspended (needed for mobile browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(console.error);
      }
      
      // Stop any currently playing note
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          // Ignore stop errors
        }
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
      
      // Start immediately - this is crucial for responsiveness
      oscillatorRef.current.start(0);
      
      // Set active note for UI
      setActiveNote(noteName);
      
      // Schedule automatic note stop after 2 seconds
      setTimeout(() => {
        if (gainNodeRef.current && oscillatorRef.current) {
          // Fade out over 100ms for a smooth ending
          const now = audioContext.currentTime;
          gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
          gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          
          // Stop the oscillator after fade completes
          setTimeout(() => {
            if (oscillatorRef.current) {
              try {
                oscillatorRef.current.stop();
                setActiveNote(null);
              } catch (e) {
                // Ignore stop errors
              }
            }
          }, 110);
        }
      }, 2000);
      
      audioLogger.log(`Playing note: ${noteName} (${note.frequency}Hz)`);
    } catch (error) {
      audioLogger.error('Error playing note:', error);
      console.error('Error playing note:', error);
    }
  };

  // Stop the currently playing note
  const stopNote = () => {
    if (gainNodeRef.current && oscillatorRef.current) {
      try {
        const audioContext = getAudioContext();
        
        // Quick fade out
        const now = audioContext.currentTime;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        // Stop oscillator after fade
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            setActiveNote(null);
          }
        }, 60);
      } catch (e) {
        // Ignore stop errors
        console.error('Error stopping note:', e);
      }
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

  // Handle initial user interaction to unblock audio (especially on iOS)
  const handleButtonClick = (note: string) => {
    const audioContext = getAudioContext();
    
    // For iOS Safari, we need user interaction to start audio
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        // After resuming, play the note
        playNote(note);
      }).catch(err => {
        console.error('Failed to resume audio context:', err);
      });
    } else {
      // Context already running, just play the note
      playNote(note);
    }
  };

  return (
    <div className={cn("flex flex-col items-center p-2", className)} onClick={() => getAudioContext().resume()}>
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
            onClick={() => handleButtonClick(note)}
            onMouseDown={() => handleButtonClick(note)} // For faster response on desktop
            onTouchStart={() => handleButtonClick(note)} // For faster response on mobile
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
