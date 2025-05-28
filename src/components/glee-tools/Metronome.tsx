
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Clock } from 'lucide-react';

interface MetronomeProps {
  onClose?: () => void;
}

export function Metronome({ onClose }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const playClick = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Higher pitch for beat 1, lower for others
      oscillator.frequency.setValueAtTime(currentBeat === 0 ? 1000 : 800, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      oscillator.onended = () => {
        audioContext.close();
      };
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      // Stop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentBeat(0);
    } else {
      // Start
      setIsPlaying(true);
      const interval = (60 / bpm) * 1000;
      
      const tick = () => {
        playClick();
        setCurrentBeat(prev => (prev + 1) % 4);
      };
      
      tick(); // Play immediately
      intervalRef.current = window.setInterval(tick, interval);
    }
  };

  // Update interval when BPM changes
  React.useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      const interval = (60 / bpm) * 1000;
      intervalRef.current = window.setInterval(() => {
        playClick();
        setCurrentBeat(prev => (prev + 1) % 4);
      }, interval);
    }
  }, [bpm, isPlaying]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Metronome
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{bpm}</div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[bpm]}
            onValueChange={(values) => setBpm(values[0])}
            min={60}
            max={200}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex justify-center space-x-2">
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

        <div className="flex justify-center">
          <Button onClick={toggle} size="lg" className="w-20 h-20 rounded-full">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>

        {onClose && (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
