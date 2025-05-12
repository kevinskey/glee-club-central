
import { useState, useEffect, useRef } from "react";
import { Music, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
        
        // iOS Safari requires user interaction to start audio context
        if (audioContextRef.current.state === 'suspended') {
          console.log('Audio context is suspended. Attempting to resume on user interaction.');
        }
      }
      return audioContextRef.current;
    } catch (error) {
      console.error("Failed to create audio context:", error);
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
        // Use the WAV files directly from the public directory
        const loadSoundFile = async (filename: string) => {
          try {
            const response = await fetch(`/sounds/${filename}`);
            if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
            
            const arrayBuffer = await response.arrayBuffer();
            if (!arrayBuffer) throw new Error(`Invalid audio data from ${filename}`);
            
            return await audioContext.decodeAudioData(arrayBuffer);
          } catch (error) {
            console.error(`Failed to load sound from ${filename}:`, error);
            throw error;
          }
        };

        // Load all sound files - using the .wav files that are already in the project
        const [clickBuffer, beepBuffer, woodblockBuffer] = await Promise.all([
          loadSoundFile('click.wav'),
          loadSoundFile('beep.wav'),
          loadSoundFile('woodblock.wav')
        ]);
        
        if (!isMounted) return;

        audioBuffersRef.current = {
          click: clickBuffer,
          beep: beepBuffer,
          woodblock: woodblockBuffer
        };
        
        setAudioLoaded(true);
        console.log("✅ All metronome sounds loaded successfully");
      } catch (error) {
        console.error("Failed to load metronome sounds:", error);
        if (isMounted) {
          toast.error("Failed to load audio files. Please refresh the page.");
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
          console.error("Failed to resume audio context:", err);
        });
        return;
      }
      return;
    }
    
    const buffer = audioBuffersRef.current[soundName || 'click'];
    if (!buffer) {
      console.error(`Sound buffer not found for: ${soundName}`);
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
      console.error("Error playing sound:", error);
    }
  };

  // Start or stop metronome based on isPlaying state
  useEffect(() => {
    const audioContext = audioContextRef.current;
    
    const startMetronome = () => {
      if (!audioLoaded || !audioContext) {
        console.log("Audio not ready yet, waiting...");
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
          console.error("Failed to resume audio context:", err);
        });
      }
      
      console.log("Starting metronome at", bpm, "BPM");
      
      timerRef.current = window.setInterval(() => {
        const beatsPerMeasure = getBeatsPerMeasure();
        
        // First beat is accented
        const isFirstBeat = beatCountRef.current === 0;
        
        if (isFirstBeat) {
          playSound('click', true);
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
        console.error("Failed to resume audio context:", err);
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
