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

// Pre-calculate frequencies for quick access
const calculateFrequencies = () => {
  const freqMap: Record<string, number[]> = {};
  for (const key of PIANO_KEYS) {
    freqMap[key.note] = [];
    for (let oct = 1; oct <= 7; oct++) {
      // Calculate frequency: C4 (middle C) = 261.63 Hz
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
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, { oscillator: OscillatorNode, gain: GainNode }>>(new Map());
  const keyboardRef = useRef<HTMLDivElement>(null);
  
  // Get or create audio context
  const getAudioContext = (): AudioContext => {
    // Use the provided audio context if available
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    // Otherwise create or use our local audio context
    if (!localAudioContextRef.current) {
      localAudioContextRef.current = createAudioContext();
    }
    
    return localAudioContextRef.current;
  };
  
  // Determine key size dimensions based on selected size and screen size
  const getKeySizes = () => {
    // Base sizes that will be modified by the keySize setting
    let whiteKeyHeight = 120;
    let blackKeyHeight = 72;
    
    // Adjust base on device size
    if (isSmallMobile) {
      whiteKeyHeight = 100;
      blackKeyHeight = 60;
    } else if (isMobile) {
      whiteKeyHeight = 110;
      blackKeyHeight = 66;
    }
    
    // Apply size modifier
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
  
  // Function to render piano keys - now with fixed width for proper scrolling
  const renderPianoKeys = () => {
    // Render more octaves to allow horizontal scrolling
    const octaves = [startOctave, startOctave + 1, startOctave + 2, startOctave + 3, startOctave + 4];
    const whiteKeys: React.ReactNode[] = [];
    const blackKeys: React.ReactNode[] = [];
    
    // Use fixed width for keys to enable proper scrolling
    const whiteKeyWidth = 40; // Fixed width in pixels
    
    // Keep track of total position for black keys
    let totalPosition = 0;
    
    // Render all octaves
    octaves.forEach(octave => {
      // Keep track of white key position for black key positioning
      let whiteKeyCount = 0;
      
      PIANO_KEYS.forEach((key) => {
        const noteId = `${key.note}-${octave}`;
        
        if (!key.isSharp) {
          // White key
          whiteKeys.push(
            <button
              key={noteId}
              className="bg-white border border-gray-300 rounded-b hover:bg-gray-100 active:bg-gray-200 relative flex flex-col-reverse"
              style={{ 
                width: `${whiteKeyWidth}px`,
                height: '100%'
              }}
              onMouseDown={() => playNote(key.note, octave)}
              onTouchStart={() => playNote(key.note, octave)}
              onMouseUp={() => stopNote(`${key.note}-${octave}`)}
              onTouchEnd={() => stopNote(`${key.note}-${octave}`)}
              onMouseLeave={() => stopNote(`${key.note}-${octave}`)}
            >
              <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {key.note}{octave}
              </span>
            </button>
          );
          whiteKeyCount++;
          totalPosition += whiteKeyWidth;
        } else {
          // Black key
          // Position black key relative to the previous white key
          const position = totalPosition - (whiteKeyWidth / 2) - 10;
          blackKeys.push(
            <button
              key={noteId}
              className="absolute top-0 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
              style={{ 
                left: `${position}px`,
                width: `${whiteKeyWidth * 0.6}px`,
                height: blackKeyHeight
              }}
              onMouseDown={() => playNote(key.note, octave)}
              onTouchStart={() => playNote(key.note, octave)}
              onMouseUp={() => stopNote(`${key.note}-${octave}`)}
              onTouchEnd={() => stopNote(`${key.note}-${octave}`)}
              onMouseLeave={() => stopNote(`${key.note}-${octave}`)}
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
  
  // Initialize audio context with low latency options
  useEffect(() => {
    // Initialize only if we're using the local context
    if (!audioContextRef?.current) {
      localAudioContextRef.current = createAudioContext();
      
      // Optimize audio context for low latency
      if (localAudioContextRef.current && 'audioWorklet' in localAudioContextRef.current) {
        localAudioContextRef.current.resume().catch(console.error);
      }
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
      
      // Close audio context only if it's our local one
      if (!audioContextRef && localAudioContextRef.current && localAudioContextRef.current.state !== 'closed') {
        localAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioContextRef]);
  
  // Scroll to middle C on load
  useEffect(() => {
    if (keyboardRef.current) {
      // Scroll to a reasonable starting position (about 1/3 of the way)
      const scrollPosition = keyboardRef.current.scrollWidth / 3;
      keyboardRef.current.scrollLeft = scrollPosition;
    }
  }, [keySize]);
  
  // Play piano note with optimized handling
  const playNote = (note: string, octave: number) => {
    const ctx = getAudioContext();
    
    // Resume context if suspended (needed for mobile)
    if (ctx.state === 'suspended') {
      resumeAudioContext(ctx).catch(console.error);
    }
    
    const noteKey = `${note}-${octave}`;
    
    // Stop any existing note
    stopNote(noteKey);
    
    // Create optimized oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Set note frequency directly from pre-calculated table
    osc.frequency.value = NOTE_FREQUENCIES[note][octave];
    osc.type = 'sine';
    
    // Use more immediate envelope for faster response
    gain.gain.value = volume;
    
    // Connect nodes and play immediately
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Start immediately
    osc.start();
    
    // Store references for cleanup
    oscillatorsRef.current.set(noteKey, { oscillator: osc, gain });
  };
  
  // Stop a specific note
  const stopNote = (noteKey: string) => {
    const nodes = oscillatorsRef.current.get(noteKey);
    if (nodes) {
      try {
        const { oscillator, gain } = nodes;
        
        // Quick fade out to avoid clicks
        const ctx = getAudioContext();
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
        
        // Stop after fade out
        setTimeout(() => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
          } catch (e) {
            // Ignore stop errors
          }
        }, 35);
        
        oscillatorsRef.current.delete(noteKey);
      } catch (e) {
        console.error('Error stopping note:', e);
      }
    }
  };

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Piano Keyboard</h3>
        <p className="text-xs text-muted-foreground">Scroll horizontally to see more notes</p>
      </div>
      
      {/* Full-width Piano Keyboard with horizontal scrolling */}
      <div className="w-full overflow-hidden">
        {renderPianoKeys()}
      </div>
      
      {/* Key Size Options */}
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
      
      {/* Octave control */}
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
      
      {/* Volume control */}
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
