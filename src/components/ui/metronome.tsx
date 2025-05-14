
import { useState, useEffect, useRef } from "react";
import { Music, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { audioLogger } from "@/utils/audioUtils";

interface MetronomeProps {
  isPlaying?: boolean;
  bpm?: number;
  timeSignature?: string;
  showControls?: boolean;
}

export function Metronome({
  isPlaying: propIsPlaying = false,
  bpm: propBpm = 100,
  timeSignature: propTimeSignature = "4/4",
  showControls = false,
}: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(propIsPlaying);
  const [bpm, setBpm] = useState(propBpm);
  const [timeSignature, setTimeSignature] = useState(propTimeSignature);
  const [volume, setVolume] = useState(0.5);
  const [soundType, setSoundType] = useState<"click" | "beep" | "woodblock">("click");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  
  // Beats per measure based on time signature
  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };

  // Initialize audio context with safety checks for different browsers
  const initAudioContext = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        audioLogger.log('Metronome: Audio context created');
        
        // iOS Safari requires user interaction to start audio context
        if (audioContextRef.current.state === 'suspended') {
          audioLogger.log('Metronome: Audio context is suspended. Will resume on user interaction.');
        }
      }
      return audioContextRef.current;
    } catch (error) {
      audioLogger.error("Metronome: Failed to create audio context:", error);
      toast.error("Audio system initialization failed. Please try a different browser.");
      return null;
    }
  };

  // Initialize audio system once on component mount
  useEffect(() => {
    initAudioContext();
    
    return () => {
      stopAllSounds();
      
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      
      // Close context on unmount
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Clean up any lingering sounds
  const stopAllSounds = () => {
    // Stop all oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    // Disconnect all gain nodes
    gainNodesRef.current.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Gain might already be disconnected
      }
    });
    
    // Clear the arrays
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
  };

  // Update isPlaying state when prop changes
  useEffect(() => {
    setIsPlaying(propIsPlaying);
  }, [propIsPlaying]);
  
  // Update BPM when prop changes
  useEffect(() => {
    setBpm(propBpm);
  }, [propBpm]);

  // Play a sound with Web Audio API
  const playSound = (isAccent: boolean = false) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state !== 'running') {
      // Try to resume the context if it's suspended (mobile browser policy)
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          // Retry playing after resuming
          setTimeout(() => playSound(isAccent), 10);
        }).catch(err => {
          audioLogger.error("Metronome: Failed to resume audio context:", err);
        });
        return;
      }
      return;
    }
    
    try {
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Store references for cleanup
      oscillatorsRef.current.push(oscillator);
      gainNodesRef.current.push(gainNode);
      
      // Configure sound based on type
      switch (soundType) {
        case "beep":
          oscillator.type = "sine";
          oscillator.frequency.value = isAccent ? 880 : 660;
          break;
        case "woodblock":
          oscillator.type = "triangle";
          oscillator.frequency.value = isAccent ? 1200 : 900;
          break;
        case "click":
        default:
          oscillator.type = "square";
          oscillator.frequency.value = isAccent ? 1800 : 1600;
          break;
      }
      
      // Set volume based on accent and user volume setting
      gainNode.gain.value = isAccent ? Math.min(volume * 1.5, 1.0) : volume;
      
      // Create envelope for the sound
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      
      if (soundType === 'click') {
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else {
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + (soundType === 'beep' ? 0.1 : 0.08));
      }
      
      // Connect and start
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(now + 0.15);
      
      // Clean up after sound finishes
      setTimeout(() => {
        const index = oscillatorsRef.current.indexOf(oscillator);
        if (index !== -1) {
          oscillatorsRef.current.splice(index, 1);
          gainNodesRef.current.splice(index, 1);
        }
      }, 200);
    } catch (error) {
      audioLogger.error("Metronome: Error playing sound:", error);
    }
  };

  // Start or stop metronome based on isPlaying state
  useEffect(() => {
    const audioContext = audioContextRef.current;
    
    const startMetronome = () => {
      if (!audioContext) {
        audioLogger.log("Metronome: Audio not ready yet, waiting...");
        return;
      }
      
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      
      beatCountRef.current = 0;
      const intervalMs = (60 / bpm) * 1000;
      
      // Resume audio context if needed (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(err => {
          audioLogger.error("Metronome: Failed to resume audio context:", err);
        });
      }
      
      audioLogger.log(`Metronome: Starting at ${bpm} BPM`);
      
      timerRef.current = window.setInterval(() => {
        const beatsPerMeasure = getBeatsPerMeasure();
        
        // First beat is accented
        const isFirstBeat = beatCountRef.current === 0;
        
        playSound(isFirstBeat);
        
        // Update beat counter
        beatCountRef.current = (beatCountRef.current + 1) % beatsPerMeasure;
      }, intervalMs);
    };
    
    if (isPlaying) {
      startMetronome();
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      stopAllSounds();
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        stopAllSounds();
      }
    };
  }, [isPlaying, bpm, timeSignature, soundType, volume]);
  
  if (!showControls) {
    return null; // Don't render UI if controls are hidden
  }

  // Handle toggle click with user interaction for mobile
  const handleToggleClick = () => {
    // Initialize or resume audio context on user interaction
    const audioContext = audioContextRef.current || initAudioContext();
    
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(err => {
        audioLogger.error("Metronome: Failed to resume audio context:", err);
      });
    }
    
    // Play a silent sound to unlock audio on iOS
    if (!isPlaying && audioContext) {
      const silentOscillator = audioContext.createOscillator();
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0.001;
      silentOscillator.connect(silentGain);
      silentGain.connect(audioContext.destination);
      silentOscillator.start();
      silentOscillator.stop(audioContext.currentTime + 0.001);
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Music className="h-4 w-4 mr-2" /> Metronome
          </h3>
          
          <Button
            size="sm"
            variant={isPlaying ? "destructive" : "default"}
            onClick={handleToggleClick}
          >
            {isPlaying ? "Stop" : "Start"}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo: {bpm} BPM</label>
            <Slider
              value={[bpm]}
              min={40}
              max={208}
              step={1}
              onValueChange={(value) => setBpm(value[0])}
              disabled={isPlaying}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Signature</label>
            <ToggleGroup type="single" value={timeSignature} onValueChange={(value) => {
              if (value) setTimeSignature(value);
            }} disabled={isPlaying}>
              <ToggleGroupItem value="2/4" aria-label="2/4 time">2/4</ToggleGroupItem>
              <ToggleGroupItem value="3/4" aria-label="3/4 time">3/4</ToggleGroupItem>
              <ToggleGroupItem value="4/4" aria-label="4/4 time">4/4</ToggleGroupItem>
              <ToggleGroupItem value="6/8" aria-label="6/8 time">6/8</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Volume2 className="h-4 w-4 mr-2" /> Volume
            </label>
            <Slider
              value={[volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sound</label>
            <ToggleGroup type="single" value={soundType} onValueChange={(value: "click" | "beep" | "woodblock") => {
              if (value) setSoundType(value);
            }}>
              <ToggleGroupItem value="click" aria-label="Click sound">Click</ToggleGroupItem>
              <ToggleGroupItem value="beep" aria-label="Beep sound">Beep</ToggleGroupItem>
              <ToggleGroupItem value="woodblock" aria-label="Woodblock sound">Woodblock</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </Card>
  );
}
