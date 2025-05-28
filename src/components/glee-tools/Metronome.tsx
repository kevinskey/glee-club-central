
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2 } from 'lucide-react';
import { audioLogger } from '@/utils/audioUtils';

interface MetronomeProps {
  audioContextRef?: React.RefObject<AudioContext | null>;
  onClose?: () => void;
}

export function Metronome({ audioContextRef, onClose }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.5);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const nextBeatTime = useRef<number>(0);

  // Initialize audio context
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
        audioLogger.log('Metronome: Audio context initialized');
      } catch (error) {
        audioLogger.error('Metronome: Failed to initialize audio', error);
      }
    };

    initAudio();
    
    return () => {
      stop();
    };
  }, [audioContextRef]);

  const getAudioContext = (): AudioContext | null => {
    return audioContextRef?.current || localAudioContextRef.current;
  };

  const playClick = useCallback((isAccent: boolean = false) => {
    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = isAccent ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(isAccent ? 1000 : 800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      audioLogger.error('Error playing metronome click:', error);
    }
  }, [volume]);

  const scheduleNextBeat = useCallback(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const secondsPerBeat = 60.0 / bpm;
    
    // Schedule beats slightly ahead of time for precision
    while (nextBeatTime.current < audioContext.currentTime + 0.1) {
      const isAccent = currentBeat === 0;
      playClick(isAccent);
      
      setCurrentBeat(prevBeat => (prevBeat + 1) % 4);
      nextBeatTime.current += secondsPerBeat;
    }
  }, [bpm, currentBeat, playClick]);

  const start = useCallback(async () => {
    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      nextBeatTime.current = audioContext.currentTime;
      setCurrentBeat(0);
      setIsPlaying(true);

      // Use a more precise timing method
      const tick = () => {
        scheduleNextBeat();
        intervalRef.current = requestAnimationFrame(tick);
      };
      
      tick();
      audioLogger.log(`Metronome started at ${bpm} BPM`);
    } catch (error) {
      audioLogger.error('Error starting metronome:', error);
    }
  }, [bpm, scheduleNextBeat]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
    audioLogger.log('Metronome stopped');
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Initializing audio...</div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-mono font-bold mb-2">{bpm}</div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Tempo</label>
            <Slider
              value={[bpm]}
              onValueChange={(values) => setBpm(values[0])}
              min={60}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>60</span>
              <span>200</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              Volume
            </label>
            <Slider
              value={[volume * 100]}
              onValueChange={(values) => setVolume(values[0] / 100)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <Button
            onClick={toggle}
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

        <div className="flex justify-center space-x-2 mb-4">
          {[0, 1, 2, 3].map((beat) => (
            <div
              key={beat}
              className={`w-3 h-3 rounded-full transition-colors ${
                isPlaying && currentBeat === beat
                  ? beat === 0 ? 'bg-red-500' : 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
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
