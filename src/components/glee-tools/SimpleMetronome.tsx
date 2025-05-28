
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimpleAudioEngine } from './SimpleAudioEngine';

interface SimpleMetronomeProps {
  onClose?: () => void;
}

const TIME_SIGNATURES = [
  { name: '4/4', beats: 4 },
  { name: '3/4', beats: 3 },
  { name: '2/4', beats: 2 },
  { name: '6/8', beats: 6 },
  { name: '5/4', beats: 5 },
  { name: '7/8', beats: 7 }
];

export function SimpleMetronome({ onClose }: SimpleMetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(75);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[0]);
  const [isReady, setIsReady] = useState(false);
  
  const audioEngineRef = useRef<SimpleAudioEngine | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

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
        console.log('Simple metronome initialized');
      } catch (error) {
        console.error('Failed to initialize simple metronome:', error);
      }
    };

    initAudio();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playMetronomeSound = useCallback(async (isAccent: boolean = false) => {
    if (!isReady || !audioEngineRef.current || !audioContextRef.current || !mountedRef.current) return;
    
    try {
      // Resume audio context if needed
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const frequency = isAccent ? 1000 : 800;
      const adjustedVolume = (volume / 100) * 0.3;
      
      audioEngineRef.current.playTone(frequency, 0.1, adjustedVolume);
    } catch (error) {
      console.error('Error playing metronome sound:', error);
    }
  }, [isReady, volume]);

  const startMetronome = useCallback(() => {
    if (!isReady || isPlaying || !mountedRef.current) return;
    
    setIsPlaying(true);
    setCurrentBeat(0);
    
    const beatInterval = (60 / bpm) * 1000;
    
    const tick = () => {
      if (!mountedRef.current) return;
      
      setCurrentBeat(prevBeat => {
        const newBeat = (prevBeat + 1) % timeSignature.beats;
        const isAccent = newBeat === 0;
        
        playMetronomeSound(isAccent);
        
        return newBeat;
      });
    };
    
    // Play first beat immediately
    tick();
    
    // Set up interval for subsequent beats
    intervalRef.current = window.setInterval(tick, beatInterval);
  }, [isReady, isPlaying, bpm, timeSignature.beats, playMetronomeSound]);

  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  const toggleMetronome = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);

  // Update metronome when BPM changes
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(startMetronome, 100);
    }
  }, [bpm]);

  // Show loading state
  if (!isReady) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Initializing metronome...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Metronome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">{bpm}</div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tempo</label>
          <Slider
            value={[bpm]}
            onValueChange={(values) => setBpm(values[0])}
            min={40}
            max={300}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>40</span>
            <span>300</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time Signature</label>
          <Select 
            value={timeSignature.name} 
            onValueChange={(value) => {
              const sig = TIME_SIGNATURES.find(ts => ts.name === value);
              if (sig) setTimeSignature(sig);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_SIGNATURES.map(sig => (
                <SelectItem key={sig.name} value={sig.name}>
                  {sig.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <div className="flex justify-center space-x-2">
          {Array.from({ length: timeSignature.beats }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-150",
                isPlaying && currentBeat === i
                  ? i === 0 ? 'bg-red-500 shadow-lg' : 'bg-blue-500 shadow-lg'
                  : 'bg-gray-300'
              )}
            />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleMetronome}
            variant={isPlaying ? "destructive" : "default"}
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>

        {onClose && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
