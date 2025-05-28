
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2 } from 'lucide-react';
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
  const [soundType, setSoundType] = useState('woodblock');
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  
  const { 
    isInitialized, 
    isLoading, 
    error,
    playNote,
    loadInstrument
  } = useAdvancedAudio();
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Create metronome sounds using Tone.js
  const playMetronomeSound = useCallback(async (isAccent: boolean = false) => {
    if (!isInitialized) return;
    
    try {
      const velocity = Math.round((volume / 100) * 127);
      const note = isAccent ? 'C5' : 'C4';
      
      switch (soundType) {
        case 'woodblock':
          await playNote(note, velocity, 0.1, 'woodblock');
          break;
        case 'synth':
          // Use a synthetic tone
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease(isAccent ? 1000 : 800, '16n');
          break;
        case 'percussion':
          await playNote(note, velocity, 0.1, 'acoustic_bass_drum');
          break;
        case 'bell':
          await playNote(note, velocity, 0.2, 'tubular_bells');
          break;
        default:
          // Fallback to simple oscillator
          const osc = new Tone.Oscillator(isAccent ? 1000 : 800, 'triangle').toDestination();
          const gain = new Tone.Gain((volume / 100) * 0.3).toDestination();
          osc.connect(gain);
          osc.start();
          osc.stop('+0.1');
      }
    } catch (error) {
      console.error('Error playing metronome sound:', error);
    }
  }, [isInitialized, volume, soundType, playNote]);

  const startMetronome = useCallback(() => {
    if (!isInitialized || isPlaying) return;
    
    setIsPlaying(true);
    setCurrentBeat(0);
    startTimeRef.current = Date.now();
    
    const beatInterval = (60 / bpm) * 1000; // milliseconds per beat
    
    const tick = () => {
      setCurrentBeat(prevBeat => {
        const newBeat = (prevBeat + 1) % timeSignature.beats;
        const isAccent = newBeat === 0;
        
        playMetronomeSound(isAccent);
        
        return newBeat;
      });
    };
    
    // Play the first beat immediately
    tick();
    
    // Set up the interval
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

  // Tap tempo functionality
  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4); // Keep only last 4 taps
    
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
    
    // Clear tap times after 3 seconds of inactivity
    setTimeout(() => {
      setTapTimes(prev => prev.filter(time => now - time < 3000));
    }, 3000);
  }, [tapTimes]);

  // Update interval when BPM changes during playback
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(startMetronome, 100); // Small delay to avoid timing issues
    }
  }, [bpm]); // Only depend on bpm to avoid infinite loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
            <div className="text-sm text-muted-foreground">{error}</div>
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
        {/* BPM Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">{bpm}</div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>

        {/* BPM Slider */}
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

        {/* Time Signature */}
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

        {/* Sound Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sound</label>
          <Select value={soundType} onValueChange={setSoundType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRONOME_SOUNDS.map(sound => (
                <SelectItem key={sound.id} value={sound.id}>
                  {sound.name}
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

        {/* Beat Indicator */}
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

        {/* Controls */}
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

        {/* Close Button */}
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
