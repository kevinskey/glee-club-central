
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Music, 
  Volume2
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Update sound paths to use raw strings instead of relative paths
const SOUNDS = {
  click: "sounds/metronome-click.mp3",
  woodblock: "sounds/metronome-woodblock.mp3",
  beep: "sounds/metronome-beep.mp3",
};

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [soundType, setSoundType] = useState<keyof typeof SOUNDS>("click");
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastBeatTimeRef = useRef<number>(0);
  
  // Effect to create audio element
  useEffect(() => {
    audioRef.current = new Audio(SOUNDS[soundType]);
    audioRef.current.volume = volume;
    
    // Log successful audio creation
    console.log("Audio element created with source:", SOUNDS[soundType]);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundType, volume]);
  
  // Calculate interval from tempo (beats per minute)
  const getIntervalFromTempo = (bpm: number) => {
    return 60000 / bpm; // Convert BPM to milliseconds per beat
  };
  
  // Handle play/pause
  useEffect(() => {
    const playBeat = () => {
      if (audioRef.current) {
        // Clone the audio to allow overlapping sounds
        const sound = audioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = volume;
        sound.play()
          .then(() => console.log("Metronome sound played successfully"))
          .catch(err => console.error("Error playing metronome:", err));
      }
    };
    
    if (isPlaying) {
      // Use requestAnimationFrame for more accurate timing
      const animationCallback = (timestamp: number) => {
        if (!lastBeatTimeRef.current) {
          lastBeatTimeRef.current = timestamp;
        }
        
        const interval = getIntervalFromTempo(tempo);
        
        if (timestamp - lastBeatTimeRef.current >= interval) {
          playBeat();
          // Adjust for drift
          lastBeatTimeRef.current = timestamp - ((timestamp - lastBeatTimeRef.current) % interval);
        }
        
        intervalRef.current = requestAnimationFrame(animationCallback);
      };
      
      intervalRef.current = requestAnimationFrame(animationCallback);
    } else {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
        lastBeatTimeRef.current = 0;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, tempo, volume]);
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full transition-colors hover:bg-accent/10"
          >
            <Music className="h-4 w-4 text-glee-purple" />
            <span className="sr-only">Open metronome</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Metronome</h4>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 rounded-full p-0 ${
                  isPlaying ? "text-glee-purple" : "text-muted-foreground"
                }`}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isPlaying ? "Pause" : "Play"} metronome
                </span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tempo</span>
                <span className="text-sm font-medium">{tempo} BPM</span>
              </div>
              <Slider
                value={[tempo]}
                min={40}
                max={240}
                step={1}
                onValueChange={(value) => setTempo(value[0])}
                className="[&_.absolute]:bg-glee-purple"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Sound Type</label>
              <Select
                value={soundType}
                onValueChange={(value: keyof typeof SOUNDS) => setSoundType(value)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="woodblock">Woodblock</SelectItem>
                  <SelectItem value="beep">Beep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm">
                  <Volume2 className="mr-1 h-3 w-3" /> Volume
                </span>
                <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="[&_.absolute]:bg-glee-purple"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
