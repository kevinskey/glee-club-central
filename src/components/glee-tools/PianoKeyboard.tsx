
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";
import { createAudioContext, resumeAudioContext } from "@/utils/audioUtils";

const PIANO_KEYS = [
  { note: 'C', isSharp: false },
  { note: 'C#', isSharp: true },
  { note: 'D', isSharp: false },
  { note: 'D#', isSharp: true },
  { note: 'E', isSharp: false },
  { note: 'F', isSharp: false },
  { note: 'F#', isSharp: true },
  { note: 'G', isSharp: false },
  { note: 'G#', isSharp: true },
  { note: 'A', isSharp: false },
  { note: 'A#', isSharp: true },
  { note: 'B', isSharp: false }
];

const calculateFrequencies = () => {
  const freqMap: Record<string, number[]> = {};
  for (const key of PIANO_KEYS) {
    freqMap[key.note] = [];
    for (let oct = 1; oct <= 7; oct++) {
      const baseFreq = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      }[key.note];
      
      freqMap[key.note][oct] = baseFreq * Math.pow(2, oct - 4);
    }
  }
  return freqMap;
};

const NOTE_FREQUENCIES = calculateFrequencies();

type KeySizeOption = 'small' | 'medium' | 'large';

interface PianoKeyboardProps {
  onClose?: () => void;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function PianoKeyboard({ onClose, audioContextRef }: PianoKeyboardProps) {
  const [startOctave, setStartOctave] = useState(3);
  const [keySize, setKeySize] = useState<KeySizeOption>('medium');
  const [volume, setVolume] = useState(0.7);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, { oscillator: OscillatorNode, gain: GainNode }>>(new Map());
  const keyboardRef = useRef<HTMLDivElement>(null);
  
  // Get or create audio context
  const getAudioContext = (): AudioContext | null => {
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    if (!localAudioContextRef.current) {
      try {
        localAudioContextRef.current = createAudioContext();
        console.log('PianoKeyboard: Created audio context with state:', localAudioContextRef.current.state);
      } catch (error) {
        console.error('PianoKeyboard: Failed to create audio context:', error);
        return null;
      }
    }
    
    return localAudioContextRef.current;
  };
  
  // Initialize audio context
  useEffect(() => {
    const audioContext = getAudioContext();
    if (audioContext) {
      setIsInitialized(true);
      console.log('PianoKeyboard: Audio context initialized');
    }
    
    return () => {
      // Clean up oscillators
      oscillatorsRef.current.forEach((nodes) => {
        try {
          nodes.oscillator.stop();
          nodes.oscillator.disconnect();
          nodes.gain.disconnect();
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      
      if (!audioContextRef && localAudioContextRef.current && localAudioContextRef.current.state !== 'closed') {
        localAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioContextRef]);
  
  // Scroll to middle C on load
  useEffect(() => {
    if (keyboardRef.current) {
      const scrollPosition = keyboardRef.current.scrollWidth / 3;
      keyboardRef.current.scrollLeft = scrollPosition;
    }
  }, [keySize]);
  
  // Determine key size dimensions
  const getKeySizes = () => {
    let whiteKeyHeight = 120;
    let blackKeyHeight = 72;
    
    if (isSmallMobile) {
      whiteKeyHeight = 100;
      blackKeyHeight = 60;
    } else if (isMobile) {
      whiteKeyHeight = 110;
      blackKeyHeight = 66;
    }
    
    const sizeModifiers = {
      small: 0.75,
      medium: 1,
      large: 1.25
    };
    
    const modifier = sizeModifiers[keySize];
    
    return {
      whiteKeyHeight: Math.round(whiteKeyHeight * modifier),
      blackKeyHeight: Math.round(blackKeyHeight * modifier)
    };
  };
  
  const { whiteKeyHeight, blackKeyHeight } = getKeySizes();
  
  // Play piano note
  const playNote = async (note: string, octave: number) => {
    const audioContext = getAudioContext();
    if (!audioContext) {
      console.error('PianoKeyboard: No audio context available');
      return;
    }
    
    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        console.log('PianoKeyboard: Audio context resumed');
      } catch (error) {
        console.error('PianoKeyboard: Failed to resume audio context:', error);
        return;
      }
    }
    
    const noteKey = `${note}-${octave}`;
    
    // Don't start if already playing
    if (oscillatorsRef.current.has(noteKey)) {
      return;
    }
    
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.frequency.value = NOTE_FREQUENCIES[note][octave];
      osc.type = 'sine';
      gain.gain.value = volume;
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      
      oscillatorsRef.current.set(noteKey, { oscillator: osc, gain });
      setActiveNotes(prev => new Set([...prev, noteKey]));
      
      console.log(`PianoKeyboard: Playing ${noteKey} at ${NOTE_FREQUENCIES[note][octave]}Hz`);
    } catch (error) {
      console.error('PianoKeyboard: Error playing note:', error);
    }
  };
  
  // Stop a specific note
  const stopNote = (noteKey: string) => {
    const nodes = oscillatorsRef.current.get(noteKey);
    if (nodes) {
      try {
        const { oscillator, gain } = nodes;
        const audioContext = getAudioContext();
        
        if (audioContext) {
          // Quick fade out
          gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
        }
        
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
          } catch (e) {
            // Ignore stop errors
          }
        }, 120);
        
        oscillatorsRef.current.delete(noteKey);
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
        
        console.log(`PianoKeyboard: Stopped ${noteKey}`);
      } catch (e) {
        console.error('PianoKeyboard: Error stopping note:', e);
      }
    }
  };

  // Function to render piano keys
  const renderPianoKeys = () => {
    const octaves = [startOctave, startOctave + 1, startOctave + 2, startOctave + 3, startOctave + 4];
    const whiteKeys: React.ReactNode[] = [];
    const blackKeys: React.ReactNode[] = [];
    
    const whiteKeyWidth = 40;
    let totalPosition = 0;
    
    octaves.forEach(octave => {
      PIANO_KEYS.forEach((key) => {
        const noteId = `${key.note}-${octave}`;
        const isActive = activeNotes.has(noteId);
        
        if (!key.isSharp) {
          whiteKeys.push(
            <button
              key={noteId}
              className={`border border-gray-300 rounded-b relative flex flex-col-reverse transition-colors ${
                isActive ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'
              }`}
              style={{ 
                width: `${whiteKeyWidth}px`,
                height: '100%'
              }}
              onMouseDown={() => playNote(key.note, octave)}
              onTouchStart={(e) => {
                e.preventDefault();
                playNote(key.note, octave);
              }}
              onMouseUp={() => stopNote(noteId)}
              onTouchEnd={() => stopNote(noteId)}
              onMouseLeave={() => stopNote(noteId)}
            >
              <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {key.note}{octave}
              </span>
            </button>
          );
          totalPosition += whiteKeyWidth;
        } else {
          const position = totalPosition - (whiteKeyWidth / 2) - 10;
          blackKeys.push(
            <button
              key={noteId}
              className={`absolute top-0 z-10 rounded-b transition-colors ${
                isActive ? 'bg-blue-500' : 'bg-gray-800 hover:bg-gray-700'
              }`}
              style={{ 
                left: `${position}px`,
                width: `${whiteKeyWidth * 0.6}px`,
                height: blackKeyHeight
              }}
              onMouseDown={() => playNote(key.note, octave)}
              onTouchStart={(e) => {
                e.preventDefault();
                playNote(key.note, octave);
              }}
              onMouseUp={() => stopNote(noteId)}
              onTouchEnd={() => stopNote(noteId)}
              onMouseLeave={() => stopNote(noteId)}
            />
          );
        }
      });
    });
    
    return (
      <div className="relative" style={{ height: whiteKeyHeight, width: '100%', overflowX: 'auto' }} ref={keyboardRef}>
        <div className="flex h-full" style={{ width: 'max-content' }}>
          {whiteKeys}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 'max-content' }}>
          {blackKeys}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Piano Keyboard</h3>
        <p className="text-xs text-muted-foreground">Scroll horizontally to see more notes</p>
      </div>
      
      <div className="w-full overflow-hidden">
        {renderPianoKeys()}
      </div>
      
      <div className="mt-4">
        <Label className="mb-2 block">Key Size</Label>
        <RadioGroup 
          value={keySize} 
          onValueChange={(value) => setKeySize(value as KeySizeOption)}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small">Small</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="large" id="large" />
            <Label htmlFor="large">Large</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setStartOctave(Math.max(1, startOctave - 1))}
          disabled={startOctave <= 1}
        >
          -
        </Button>
        <span className="min-w-20 text-center">Start Octave: {startOctave}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setStartOctave(Math.min(5, startOctave + 1))}
          disabled={startOctave >= 5}
        >
          +
        </Button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label>Volume</Label>
          <span className="text-xs">{Math.round(volume * 100)}%</span>
        </div>
        <Slider 
          value={[volume]} 
          min={0} 
          max={1} 
          step={0.01}
          onValueChange={(values) => setVolume(values[0])}
        />
      </div>
    </div>
  );
}
