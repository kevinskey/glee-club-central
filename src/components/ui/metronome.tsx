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
  
  // Audio refs
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);
  const woodblockAudioRef = useRef<HTMLAudioElement | null>(null);
  const accentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer ref
  const timerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  
  // Beats per measure based on time signature
  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };
  
  useEffect(() => {
    // Create audio elements - Fix the paths to the audio files
    if (typeof window !== 'undefined') {
      clickAudioRef.current = new Audio();
      clickAudioRef.current.src = '/sounds/metronome-click.mp3';
      clickAudioRef.current.preload = 'auto';
      
      beepAudioRef.current = new Audio();
      beepAudioRef.current.src = '/sounds/metronome-beep.mp3';
      beepAudioRef.current.preload = 'auto';
      
      woodblockAudioRef.current = new Audio();
      woodblockAudioRef.current.src = '/sounds/metronome-woodblock.mp3';
      woodblockAudioRef.current.preload = 'auto';
      
      accentAudioRef.current = new Audio();
      accentAudioRef.current.src = '/sounds/metronome-click.mp3';
      accentAudioRef.current.preload = 'auto';
      
      // Load the audio files
      const preloadAudio = async () => {
        try {
          clickAudioRef.current?.load();
          beepAudioRef.current?.load();
          woodblockAudioRef.current?.load();
          accentAudioRef.current?.load();
          
          // Test play and immediately pause to ensure browser loads the audio
          if (clickAudioRef.current) {
            clickAudioRef.current.volume = 0;
            await clickAudioRef.current.play();
            clickAudioRef.current.pause();
            clickAudioRef.current.currentTime = 0;
            clickAudioRef.current.volume = volume;
          }
        } catch (error) {
          console.error("Error preloading audio:", error);
        }
      };
      
      preloadAudio();
    }
    
    return () => {
      // Clean up interval when component unmounts
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

  // Start or stop metronome based on isPlaying state
  useEffect(() => {
    const startMetronome = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      
      beatCountRef.current = 0;
      const intervalMs = (60 / bpm) * 1000;
      
      timerRef.current = window.setInterval(() => {
        const beatsPerMeasure = getBeatsPerMeasure();
        
        // Get the appropriate audio element
        let audio;
        if (beatCountRef.current === 0) {
          // First beat is the accent
          audio = accentAudioRef.current;
        } else {
          switch (soundType) {
            case "click":
              audio = clickAudioRef.current;
              break;
            case "beep":
              audio = beepAudioRef.current;
              break;
            case "woodblock":
              audio = woodblockAudioRef.current;
              break;
            default:
              audio = clickAudioRef.current;
          }
        }
        
        if (audio) {
          // Create a new instance of the audio for each beat to allow overlapping sounds
          const audioInstance = new Audio(audio.src);
          audioInstance.volume = volume;
          audioInstance.play().catch(error => {
            console.error("Error playing metronome sound:", error);
          });
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
            onClick={() => setIsPlaying(!isPlaying)}
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
