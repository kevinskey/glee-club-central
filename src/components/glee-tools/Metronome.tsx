
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdvancedAudio } from '@/hooks/useAdvancedAudio';
import * as Tone from 'tone';

interface MetronomeProps {
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

const METRONOME_SOUNDS = [
  { name: 'Classic Click', id: 'woodblock' },
  { name: 'Digital Beep', id: 'synth' },
  { name: 'Drum Stick', id: 'percussion' },
  { name: 'Bell', id: 'bell' }
];

export function Metronome({ onClose }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(75);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[0]);
  const [soundType, setSoundType] = useState('synth'); // Use synth as default for reliability
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  
  const { 
    isInitialized, 
    isLoading, 
    error,
    retryInitialization
  } = useAdvancedAudio();
  
  const intervalRef = useRef<number | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const mountedRef = useRef(true);

  // Initialize synth for reliable metronome sound
  useEffect(() => {
    if (isInitialized && !synthRef.current) {
      try {
        synthRef.current = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
      } catch (error) {
        console.error('Failed to create synth:', error);
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [isInitialized]);

  const playMetronomeSound = useCallback(async (isAccent: boolean = false) => {
    if (!isInitialized || !synthRef.current || !mountedRef.current) return;
    
    try {
      const frequency = isAccent ? 1000 : 800;
      const velocity = (volume / 100) * 0.5;
      
      synthRef.current.volume.value = Tone.gainToDb(velocity);
      synthRef.current.triggerAttackRelease(frequency, '16n');
    } catch (error) {
      console.error('Error playing metronome sound:', error);
    }
  }, [isInitialized, volume]);

  const startMetronome = useCallback(() => {
    if (!isInitialized || isPlaying || !mountedRef.current) return;
    
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
  }, [isInitialized, isPlaying, bpm, timeSignature.beats, playMetronomeSound]);

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

  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4);
    
    setTapTimes(newTapTimes);
    
    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      
      const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      
      if (calculatedBpm >= 40 && calculatedBpm <= 300) {
        setBpm(calculatedBpm);
      }
    }
    
    setTimeout(() => {
      setTapTimes(prev => prev.filter(time => now - time < 3000));
    }, 3000);
  }, [tapTimes]);

  // Update metronome when BPM changes
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(startMetronome, 100);
    }
  }, [bpm]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopMetronome();
    };
  }, [stopMetronome]);

  if (isLoading) {
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

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Audio Error</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <Button onClick={retryInitialization} size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Professional Metronome</CardTitle>
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
            disabled={!isInitialized}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          
          <Button
            onClick={handleTapTempo}
            variant="outline"
            size="lg"
            className="px-6"
          >
            Tap Tempo
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
