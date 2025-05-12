
import { useState, useEffect, useCallback } from "react";
import { Music, Volume2, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMetronomeEngine, TimeSignature, Subdivision } from "./metronome-engine";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MetronomeProps {
  isPlaying?: boolean;
  bpm?: number;
  timeSignature?: TimeSignature;
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EnhancedMetronome({
  isPlaying: propIsPlaying = false,
  bpm: propBpm = 100,
  timeSignature: propTimeSignature = "4/4",
  showControls = false,
  size = 'md',
  className,
}: MetronomeProps) {
  // Metronome state
  const [isPlaying, setIsPlaying] = useState(propIsPlaying);
  const [bpm, setBpm] = useState(propBpm);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>(propTimeSignature);
  const [volume, setVolume] = useState(0.6);
  const [subdivision, setSubdivision] = useState<Subdivision>("quarter");
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  const [soundType, setSoundType] = useState<"click" | "beep" | "woodblock">("click");
  const [customBpm, setCustomBpm] = useState(propBpm.toString());
  const [visualBeat, setVisualBeat] = useState(0);
  const [visualSubBeat, setVisualSubBeat] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Update bpm from props
  useEffect(() => {
    setBpm(propBpm);
    setCustomBpm(propBpm.toString());
  }, [propBpm]);

  // Update isPlaying from props
  useEffect(() => {
    setIsPlaying(propIsPlaying);
  }, [propIsPlaying]);

  const handleTick = useCallback((beat: number, subBeat: number) => {
    setVisualBeat(beat);
    setVisualSubBeat(subBeat);
  }, []);

  const { audioLoaded, audioError, resumeAudioContext } = useMetronomeEngine({
    bpm,
    isPlaying,
    volume,
    timeSignature,
    soundType,
    subdivision,
    accentFirstBeat,
    onTick: handleTick,
  });

  // Handle BPM input change
  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomBpm(value);
    
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue >= 40 && parsedValue <= 300) {
      setBpm(parsedValue);
    }
  };

  // Handle BPM input blur
  const handleBpmBlur = () => {
    const parsedValue = parseInt(customBpm);
    if (isNaN(parsedValue) || parsedValue < 40) {
      setBpm(40);
      setCustomBpm("40");
    } else if (parsedValue > 300) {
      setBpm(300);
      setCustomBpm("300");
    } else {
      setBpm(parsedValue);
      setCustomBpm(parsedValue.toString());
    }
  };

  // Get beats per measure based on time signature
  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };

  // Get subdivisions per beat
  const getSubdivisionsPerBeat = () => {
    switch (subdivision) {
      case "quarter": return 1;
      case "eighth": return 2;
      case "triplet": return 3;
      case "sixteenth": return 4;
      default: return 1;
    }
  };

  // Handle toggle click with user interaction for mobile
  const handleToggleClick = () => {
    // Initialize audio on first click
    if (!audioInitialized) {
      const success = resumeAudioContext();
      if (success) {
        setAudioInitialized(true);
        toast.success("Audio system initialized");
      } else {
        toast.error("Could not initialize audio. Please check your browser permissions.");
        return;
      }
    } else {
      // Just resume audio context if already initialized
      resumeAudioContext();
    }
    
    setIsPlaying(!isPlaying);
  };

  if (!showControls) {
    return null;
  }

  const sizes = {
    sm: {
      sliderHeight: "h-1.5",
      fontSize: "text-xs",
      spacing: "space-y-2",
      padding: "p-3",
      beatSize: "h-2 w-2",
    },
    md: {
      sliderHeight: "h-2",
      fontSize: "text-sm",
      spacing: "space-y-3",
      padding: "p-4",
      beatSize: "h-3 w-3",
    },
    lg: {
      sliderHeight: "h-2.5",
      fontSize: "text-base",
      spacing: "space-y-4",
      padding: "p-5",
      beatSize: "h-4 w-4",
    }
  };

  return (
    <Card className={cn("w-full", sizes[size].padding, className)}>
      <div className={cn("flex flex-col", sizes[size].spacing)}>
        <div className="flex justify-between items-center">
          <h3 className={cn("font-semibold flex items-center", sizes[size].fontSize)}>
            <Music className="h-4 w-4 mr-2" /> Metronome
          </h3>
          
          <Button
            size={size === 'lg' ? 'default' : 'sm'}
            variant={isPlaying ? "destructive" : "default"}
            onClick={handleToggleClick}
            disabled={!audioLoaded}
          >
            {!audioLoaded ? "Loading..." : isPlaying ? "Stop" : "Start"}
          </Button>
        </div>
        
        {audioError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{audioError}</AlertDescription>
          </Alert>
        )}
        
        {/* Beat visualization */}
        <div className="flex justify-center items-center gap-2 py-2">
          {Array.from({ length: getBeatsPerMeasure() }).map((_, beatIndex) => (
            <div key={`beat-${beatIndex}`} className="flex gap-1 items-center">
              {Array.from({ length: getSubdivisionsPerBeat() }).map((_, subIndex) => {
                const isActive = isPlaying && beatIndex === visualBeat && subIndex === visualSubBeat;
                const isMainBeat = subIndex === 0;
                const isFirstBeat = beatIndex === 0 && subIndex === 0;
                
                return (
                  <div 
                    key={`sub-${beatIndex}-${subIndex}`}
                    className={cn(
                      sizes[size].beatSize,
                      "rounded-full transition-colors duration-100",
                      isActive ? (
                        isFirstBeat && accentFirstBeat ? "bg-red-500" : 
                        isMainBeat ? "bg-primary" : "bg-primary/70"
                      ) : (
                        isFirstBeat && accentFirstBeat ? "bg-red-500/30" : 
                        isMainBeat ? "bg-primary/30" : "bg-primary/20"
                      )
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        <div className={cn("flex gap-3 items-center", size === 'sm' ? "flex-col" : "")}>
          <Label htmlFor="bpm-input" className={sizes[size].fontSize}>BPM:</Label>
          <div className="flex gap-2 items-center flex-1 w-full">
            <Slider
              value={[bpm]}
              min={40}
              max={300}
              step={1}
              className={cn("flex-1", sizes[size].sliderHeight)}
              onValueChange={(value) => {
                setBpm(value[0]);
                setCustomBpm(value[0].toString());
              }}
            />
            <Input
              id="bpm-input"
              type="number"
              value={customBpm}
              onChange={handleBpmChange}
              onBlur={handleBpmBlur}
              className="w-16 text-center"
              min={40}
              max={300}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className={cn("block font-medium", sizes[size].fontSize)}>Time Signature</label>
          <ToggleGroup type="single" value={timeSignature} onValueChange={(value) => {
            if (value) setTimeSignature(value as TimeSignature);
          }}>
            <ToggleGroupItem value="2/4" aria-label="2/4 time">2/4</ToggleGroupItem>
            <ToggleGroupItem value="3/4" aria-label="3/4 time">3/4</ToggleGroupItem>
            <ToggleGroupItem value="4/4" aria-label="4/4 time">4/4</ToggleGroupItem>
            <ToggleGroupItem value="6/8" aria-label="6/8 time">6/8</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="space-y-2">
          <label className={cn("block font-medium", sizes[size].fontSize)}>Subdivision</label>
          <ToggleGroup type="single" value={subdivision} onValueChange={(value) => {
            if (value) setSubdivision(value as Subdivision);
          }}>
            <ToggleGroupItem value="quarter" aria-label="Quarter notes">1/4</ToggleGroupItem>
            <ToggleGroupItem value="eighth" aria-label="Eighth notes">1/8</ToggleGroupItem>
            <ToggleGroupItem value="triplet" aria-label="Triplets">1/8T</ToggleGroupItem>
            <ToggleGroupItem value="sixteenth" aria-label="Sixteenth notes">1/16</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={cn("font-medium", sizes[size].fontSize)}>
              <Volume2 className="h-4 w-4 inline mr-2" /> Volume
            </label>
            <div className={cn("flex items-center gap-2", sizes[size].fontSize)}>
              <label htmlFor="accent-toggle" className="cursor-pointer">Accent First Beat</label>
              <Switch
                id="accent-toggle"
                checked={accentFirstBeat}
                onCheckedChange={setAccentFirstBeat}
              />
            </div>
          </div>
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            className={sizes[size].sliderHeight}
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>
      </div>
    </Card>
  );
}
