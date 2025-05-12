
import { useState, useEffect, useRef } from "react";
import { Music, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { audioLogger, initializeAudioSystem } from "@/utils/audioUtils";

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
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<{[key: string]: AudioBuffer}>({});
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  
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

  // Load sound buffers once on component mount
  useEffect(() => {
    let isMounted = true;
    const audioContext = initAudioContext();
    
    if (!audioContext) return;

    const loadSounds = async () => {
      try {
        audioLogger.log('Metronome: Loading audio files...');
        
        // Create static sine wave buffers for sounds to avoid file loading issues
        const createBeepBuffer = () => {
          const sampleRate = audioContext.sampleRate;
          const duration = 0.1; // 100ms
          const bufferSize = sampleRate * duration;
          const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Create a sine wave
          for (let i = 0; i < bufferSize; i++) {
            // Frequency 880Hz for beep
            data[i] = Math.sin(2 * Math.PI * 880 * i / sampleRate) * 
                      // Add envelope for smoother sound
                      (i < 0.01 * sampleRate ? i / (0.01 * sampleRate) : 
                       i > (duration - 0.01) * sampleRate ? (bufferSize - i) / (0.01 * sampleRate) : 1);
          }
          
          return buffer;
        };
        
        // Create click sound
        const createClickBuffer = () => {
          const sampleRate = audioContext.sampleRate;
          const duration = 0.05; // 50ms
          const bufferSize = sampleRate * duration;
          const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Create a short sharp burst
          for (let i = 0; i < bufferSize; i++) {
            // Quick decay
            data[i] = (1 - i / bufferSize) * 
                      (Math.random() * 0.3 - 0.15 + // Add noise
                      (i < 0.01 * sampleRate ? 0.8 : 0.2)); // Initial spike
          }
          
          return buffer;
        };
        
        // Create woodblock sound
        const createWoodblockBuffer = () => {
          const sampleRate = audioContext.sampleRate;
          const duration = 0.15;
          const bufferSize = sampleRate * duration;
          const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
          const data = buffer.getChannelData(0);
          
          // Frequencies for a woodblock-like sound
          const frequencies = [1200, 800];
          
          for (let i = 0; i < bufferSize; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            // Mix frequencies
            for (const freq of frequencies) {
              sample += Math.sin(2 * Math.PI * freq * t) * Math.exp(-15 * t);
            }
            
            // Add envelope
            data[i] = sample * 0.5;
          }
          
          return buffer;
        };
        
        // Generate all our sounds programmatically
        const clickBuffer = createClickBuffer();
        const beepBuffer = createBeepBuffer();
        const woodblockBuffer = createWoodblockBuffer();
        
        if (!isMounted) return;

        audioBuffersRef.current = {
          click: clickBuffer,
          beep: beepBuffer,
          woodblock: woodblockBuffer
        };
        
        setAudioLoaded(true);
        audioLogger.log("✅ Metronome: All sounds generated successfully");
      } catch (error) {
        audioLogger.error("Metronome: Failed to generate sounds:", error);
        if (isMounted) {
          toast.error("Failed to initialize metronome. Please refresh the page.");
        }
      }
    };
    
    loadSounds();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update isPlaying state when prop changes
  useEffect(() => {
    setIsPlaying(propIsPlaying);
  }, [propIsPlaying]);
  
  // Update BPM when prop changes
  useEffect(() => {
    setBpm(propBpm);
  }, [propBpm]);

  // Play a sound with Web Audio API
  const playSound = (soundName: string, isAccent: boolean = false) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state !== 'running') {
      // Try to resume the context if it's suspended (mobile browser policy)
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          // Retry playing after resuming
          setTimeout(() => playSound(soundName, isAccent), 10);
        }).catch(err => {
          audioLogger.error("Metronome: Failed to resume audio context:", err);
        });
        return;
      }
      return;
    }
    
    const buffer = audioBuffersRef.current[soundName || 'click'];
    if (!buffer) {
      audioLogger.error(`Metronome: Sound buffer not found for: ${soundName}`);
      return;
    }
    
    try {
      // Create a new source for each sound (required for Web Audio API)
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      
      // Create gain node for volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isAccent ? Math.min(volume * 1.5, 1.0) : volume;
      
      // Connect the nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start the sound
      source.start(0);
    } catch (error) {
      audioLogger.error("Metronome: Error playing sound:", error);
    }
  };

  // Start or stop metronome based on isPlaying state
  useEffect(() => {
    const audioContext = audioContextRef.current;
    
    const startMetronome = () => {
      if (!audioLoaded || !audioContext) {
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
        
        if (isFirstBeat) {
          playSound(soundType, true);
        } else {
          playSound(soundType, false);
        }
        
        // Update beat counter
        beatCountRef.current = (beatCountRef.current + 1) % beatsPerMeasure;
      }, intervalMs);
    };
    
    if (isPlaying) {
      startMetronome();
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, bpm, timeSignature, soundType, volume, audioLoaded]);
  
  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
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
      const silentBuffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(audioContext.destination);
      source.start(0);
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
            disabled={!audioLoaded}
          >
            {!audioLoaded ? "Loading..." : isPlaying ? "Stop" : "Start"}
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
