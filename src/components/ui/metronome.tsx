import { useState, useEffect, useRef } from "react";
import { Music, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  
  // Audio context references
  const audioContextRef = useRef<AudioContext | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const beepBufferRef = useRef<AudioBuffer | null>(null);
  const woodblockBufferRef = useRef<AudioBuffer | null>(null);
  
  // Timer ref
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  
  // Beats per measure based on time signature
  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };
  
  // Initialize the Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create audio context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        
        // Load sound buffers from the base64 encoded files in public folder
        const loadSounds = async () => {
          try {
            // Get the audio data directly from the data URIs in the public folder
            const clickResponse = await fetch('/sounds/metronome-click.mp3');
            const clickArrayBuffer = await clickResponse.arrayBuffer();
            clickBufferRef.current = await audioContextRef.current!.decodeAudioData(clickArrayBuffer);
            
            const beepResponse = await fetch('/sounds/metronome-beep.mp3');
            const beepArrayBuffer = await beepResponse.arrayBuffer();
            beepBufferRef.current = await audioContextRef.current!.decodeAudioData(beepArrayBuffer);
            
            const woodblockResponse = await fetch('/sounds/metronome-woodblock.mp3');
            const woodblockArrayBuffer = await woodblockResponse.arrayBuffer();
            woodblockBufferRef.current = await audioContextRef.current!.decodeAudioData(woodblockArrayBuffer);
            
            console.log("All metronome sounds loaded successfully");
          } catch (error) {
            console.error("Failed to load metronome sounds:", error);
          }
        };
        
        loadSounds();
      } catch (error) {
        console.error("Web Audio API not supported:", error);
      }
    }
    
    return () => {
      // Clean up interval when component unmounts
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
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

  // Play a sound using Web Audio API
  const playSound = (buffer: AudioBuffer | null, isAccent: boolean = false) => {
    if (!audioContextRef.current || !buffer) return;
    
    try {
      // Resume audio context if it's suspended (needed for Safari/Chrome)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Create source from buffer
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      
      // Create gain node for volume control
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = isAccent ? volume * 1.3 : volume; // Slightly louder for accent
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Play the sound
      source.start(0);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Start or stop metronome based on isPlaying state
  useEffect(() => {
    const startMetronome = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      
      beatCountRef.current = 0;
      const intervalMs = (60 / bpm) * 1000;
      
      // Resume audio context if needed (especially important for iOS/Safari)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      timerRef.current = window.setInterval(() => {
        const beatsPerMeasure = getBeatsPerMeasure();
        
        // Get the appropriate sound buffer
        let buffer;
        const isFirstBeat = beatCountRef.current === 0;
        
        if (isFirstBeat) {
          // First beat is always the click (accent) sound
          buffer = clickBufferRef.current;
          playSound(buffer, true); // Play as accent
        } else {
          // Other beats use the selected sound type
          switch (soundType) {
            case "click":
              buffer = clickBufferRef.current;
              break;
            case "beep":
              buffer = beepBufferRef.current;
              break;
            case "woodblock":
              buffer = woodblockBufferRef.current;
              break;
            default:
              buffer = clickBufferRef.current;
          }
          
          playSound(buffer);
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
  }, [isPlaying, bpm, timeSignature, soundType, volume]);
  
  if (!showControls) {
    return null; // Don't render UI if controls are hidden
  }

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
            onClick={() => {
              // Resume audio context when user interacts (needed for autoplay policies)
              if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
              }
              setIsPlaying(!isPlaying);
            }}
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
