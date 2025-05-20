
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Play, Square, Save, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Type for metronome time signature
type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";

// Type for metronome preset
type MetronomePreset = {
  id: string;
  label: string;
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
  accentFirstBeat: boolean;
};

interface MetronomeProps {
  audioContextRef: MutableRefObject<AudioContext | null>;
}

export function Metronome({ audioContextRef }: MetronomeProps) {
  // State
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>("4/4");
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  const [presetLabel, setPresetLabel] = useState("");
  const [presets, setPresets] = useState<MetronomePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  // References
  const intervalRef = useRef<number | null>(null);
  const audioSchedulerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const nextBeatRef = useRef(0);
  const lastDrawTimeRef = useRef(0);
  
  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initialize audio
  const initAudio = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        return false;
      }
    }
    
    // Resume the audio context if it's suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }
    
    return true;
  };
  
  // Calculate the number of beats based on time signature
  const getBeatsPerMeasure = (): number => {
    return parseInt(timeSignature.split('/')[0]);
  };
  
  // Create and play a click sound for the metronome
  const playClick = (time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;
    
    try {
      // Create oscillator for the click
      const osc = audioContextRef.current.createOscillator();
      const clickGain = audioContextRef.current.createGain();
      
      // Set oscillator properties
      osc.type = "triangle";
      osc.frequency.value = isAccent ? 1200 : 800; // Higher pitch for accent
      
      // Set envelope
      clickGain.gain.value = 0;
      clickGain.gain.setValueAtTime(0, time);
      clickGain.gain.linearRampToValueAtTime(isAccent ? volume : volume * 0.7, time + 0.001);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      
      // Connect and start
      osc.connect(clickGain);
      clickGain.connect(audioContextRef.current.destination);
      osc.start(time);
      osc.stop(time + 0.1);
      
      // Cleanup
      setTimeout(() => {
        clickGain.disconnect();
        osc.disconnect();
      }, (time - audioContextRef.current!.currentTime + 0.2) * 1000);
    } catch (error) {
      console.error("Error playing metronome click:", error);
    }
  };
  
  // Schedule the next several clicks ahead of time for accurate timing
  const scheduleClicks = () => {
    if (!audioContextRef.current) return;
    
    // How far ahead to schedule audio (in seconds)
    const scheduleAheadTime = 0.1;
    
    // Calculate interval between beats
    const secondsPerBeat = 60.0 / bpm;
    
    // Schedule notes until we're ahead by the look-ahead time
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      // Get the beat index within the measure
      const beatIndex = nextBeatRef.current % getBeatsPerMeasure();
      
      // Play the click
      playClick(nextNoteTimeRef.current, beatIndex === 0 && accentFirstBeat);
      
      // Update the beat index for visual feedback
      if (audioContextRef.current.currentTime - lastDrawTimeRef.current > 0.02) {
        setCurrentBeat(beatIndex);
        lastDrawTimeRef.current = audioContextRef.current.currentTime;
      }
      
      // Increment for next beat
      nextBeatRef.current = (nextBeatRef.current + 1) % getBeatsPerMeasure();
      nextNoteTimeRef.current += secondsPerBeat;
    }
  };
  
  // Start the metronome
  const startMetronome = () => {
    if (!initAudio() || !audioContextRef.current) {
      toast({ title: "Audio Error", description: "Could not initialize audio system" });
      return;
    }
    
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    nextBeatRef.current = 0;
    lastDrawTimeRef.current = audioContextRef.current.currentTime;
    
    // Start the scheduler
    if (audioSchedulerRef.current === null) {
      audioSchedulerRef.current = window.setInterval(scheduleClicks, 25);
    }
    
    setIsPlaying(true);
  };
  
  // Stop the metronome
  const stopMetronome = () => {
    if (audioSchedulerRef.current) {
      clearInterval(audioSchedulerRef.current);
      audioSchedulerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  };
  
  // Toggle the metronome on/off
  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };
  
  // Load presets for the current user
  const loadPresets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("metronome_presets")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setPresets(data.map(item => ({
          id: item.id,
          label: item.label,
          bpm: item.bpm,
          timeSignature: item.time_signature || "4/4",
          volume: item.volume !== undefined ? item.volume : 0.7,
          accentFirstBeat: item.accent_first_beat !== undefined ? item.accent_first_beat : true
        })));
      }
    } catch (error) {
      console.error("Error loading presets:", error);
      toast({
        title: "Failed to load presets",
        description: "Could not load your saved metronome presets",
        variant: "destructive"
      });
    }
  };
  
  // Save the current settings as a preset
  const savePreset = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to save presets",
        variant: "destructive"
      });
      return;
    }
    
    if (!presetLabel.trim()) {
      toast({
        title: "Label required",
        description: "Please enter a name for your preset",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.from("metronome_presets").insert({
        user_id: user.id,
        label: presetLabel,
        bpm: bpm,
        time_signature: timeSignature,
        volume: volume,
        accent_first_beat: accentFirstBeat
      }).select();
      
      if (error) throw error;
      
      toast({
        title: "Preset saved",
        description: "Your metronome settings have been saved"
      });
      
      setPresetLabel("");
      loadPresets();
    } catch (error) {
      console.error("Error saving preset:", error);
      toast({
        title: "Save failed",
        description: "Could not save your preset",
        variant: "destructive"
      });
    }
  };
  
  // Delete a preset
  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase
        .from("metronome_presets")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Preset deleted",
        description: "Your preset has been removed"
      });
      
      loadPresets();
    } catch (error) {
      console.error("Error deleting preset:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete your preset",
        variant: "destructive"
      });
    }
  };
  
  // Load a specific preset
  const loadPreset = (preset: MetronomePreset) => {
    setBpm(preset.bpm);
    setTimeSignature(preset.timeSignature);
    setVolume(preset.volume);
    setAccentFirstBeat(preset.accentFirstBeat);
    setSelectedPresetId(preset.id);
    
    toast({
      title: "Preset loaded",
      description: `Loaded preset: ${preset.label}`
    });
  };
  
  // Load presets on component mount
  useEffect(() => {
    if (user) {
      loadPresets();
    }
    
    return () => {
      // Clean up on unmount
      stopMetronome();
    };
  }, [user]);
  
  // Render the visual metronome beat indicator
  const renderBeatIndicator = () => {
    const beatsPerMeasure = getBeatsPerMeasure();
    return (
      <div className="flex justify-center gap-2 my-4">
        {Array.from({ length: beatsPerMeasure }).map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentBeat && isPlaying
                ? index === 0 && accentFirstBeat
                  ? "bg-red-500"
                  : "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4 p-2">
      {/* BPM and Visual Beats */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Tempo (BPM)</Label>
          <span className="text-sm font-medium">{bpm}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            min={40} 
            max={240}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            className="w-20"
          />
          
          <Slider 
            value={[bpm]} 
            min={40} 
            max={240} 
            step={1}
            onValueChange={values => setBpm(values[0])}
            className="flex-1"
          />
        </div>
        
        {renderBeatIndicator()}
        
        <div className="flex justify-center">
          <Button
            onClick={toggleMetronome}
            variant={isPlaying ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Square className="h-4 w-4" /> Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Start
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Additional Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Time Signature</Label>
          <Select value={timeSignature} onValueChange={value => setTimeSignature(value as TimeSignature)}>
            <SelectTrigger>
              <SelectValue placeholder="4/4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2/4">2/4</SelectItem>
              <SelectItem value="3/4">3/4</SelectItem>
              <SelectItem value="4/4">4/4</SelectItem>
              <SelectItem value="6/8">6/8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Volume</Label>
            <span className="text-xs text-muted-foreground">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={values => setVolume(values[0])}
          />
        </div>
      </div>
      
      {/* Accent First Beat */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="accentFirstBeat"
          checked={accentFirstBeat}
          onChange={e => setAccentFirstBeat(e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="accentFirstBeat">Accent First Beat</Label>
      </div>
      
      {/* Save Preset */}
      {user && (
        <div className="space-y-2 pt-2 border-t">
          <Label>Save Current Settings</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Preset name"
              value={presetLabel}
              onChange={e => setPresetLabel(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={savePreset}
              disabled={!presetLabel.trim()}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      )}
      
      {/* Presets List */}
      {presets.length > 0 && (
        <div className="space-y-2 pt-2 border-t">
          <Label>My Presets</Label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {presets.map(preset => (
              <div 
                key={preset.id}
                className={`flex items-center justify-between p-2 rounded text-sm ${
                  selectedPresetId === preset.id 
                    ? "bg-muted/80" 
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{preset.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.bpm} BPM, {preset.timeSignature}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => loadPreset(preset)}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deletePreset(preset.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
