
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { audioLogger, resumeAudioContext, playTone, getNoteFrequency } from '@/utils/audioUtils';

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
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  audioContextRef?: React.RefObject<AudioContext | null>;
  onClose?: () => void;
}

export function PitchPipe({ 
  size = 'md', 
  className,
  audioContextRef,
  onClose
}: PitchPipeProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorRef = useRef<{
    oscillator: OscillatorNode;
    gainNode: GainNode;
    timeoutId: number;
  } | null>(null);

  // Get or create audio context
  const getAudioContext = (): AudioContext | null => {
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    if (!localAudioContextRef.current) {
      try {
        localAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('PitchPipe: Created audio context with state:', localAudioContextRef.current.state);
      } catch (error) {
        console.error('PitchPipe: Failed to create audio context:', error);
        return null;
      }
    }
    
    return localAudioContextRef.current;
  };

  // Initialize audio context on mount
  useEffect(() => {
    const audioContext = getAudioContext();
    if (audioContext) {
      setIsInitialized(true);
      console.log('PitchPipe: Audio context initialized');
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCurrentNote();
    };
  }, []);

  // Stop the current playing note
  const stopCurrentNote = () => {
    if (activeOscillatorRef.current) {
      const { oscillator, gainNode, timeoutId } = activeOscillatorRef.current;
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      try {
        // Quick fade out
        const audioContext = getAudioContext();
        if (audioContext && gainNode) {
          const now = audioContext.currentTime;
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        }
        
        // Stop oscillator after fade
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore cleanup errors
          }
        }, 110);
      } catch (e) {
        console.error('Error stopping note:', e);
      }
      
      activeOscillatorRef.current = null;
      setActiveNote(null);
    }
  };

  // Play a note
  const playNote = async (noteName: string) => {
    const audioContext = getAudioContext();
    if (!audioContext) {
      console.error('PitchPipe: No audio context available');
      return;
    }

    // Stop any currently playing note
    stopCurrentNote();

    try {
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        console.log('PitchPipe: Resuming suspended audio context');
        await audioContext.resume();
      }

      // Find the note frequency
      const note = NOTES.find(n => n.name === noteName);
      if (!note) {
        console.error('PitchPipe: Note not found:', noteName);
        return;
      }

      // Create oscillator and gain node
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.value = note.frequency;

      // Configure gain
      gainNode.gain.value = 0.5;

      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start playing
      oscillator.start(0);
      
      // Set active note
      setActiveNote(noteName);

      // Schedule auto-stop after 3 seconds
      const timeoutId = window.setTimeout(() => {
        stopCurrentNote();
      }, 3000);

      // Store reference for cleanup
      activeOscillatorRef.current = {
        oscillator,
        gainNode,
        timeoutId
      };

      console.log(`PitchPipe: Playing ${noteName} at ${note.frequency}Hz`);
    } catch (error) {
      console.error('PitchPipe: Error playing note:', error);
      setActiveNote(null);
    }
  };

  // Handle button click with user interaction
  const handleNoteClick = async (noteName: string) => {
    console.log('PitchPipe: Note clicked:', noteName);
    
    if (!isInitialized) {
      console.log('PitchPipe: Not initialized, attempting to initialize');
      const audioContext = getAudioContext();
      if (audioContext) {
        setIsInitialized(true);
      }
    }

    await playNote(noteName);
  };

  // Determine size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'lg': return 'h-14 w-14 text-lg';
      default: return 'h-10 w-10 text-sm';
    }
  };

  // Control which notes to display based on size
  const displayedNotes = size === 'sm' 
    ? ['C', 'E', 'G', 'A'] 
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
            onClick={() => handleNoteClick(note)}
          >
            {note}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2 mt-2">
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
            variant="secondary" 
            size="sm" 
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
