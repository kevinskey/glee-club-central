import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { playClick } from "@/utils/audioUtils";
import { Play, Pause, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MetronomeProps {
  onClose?: () => void;
}

export function Metronome({ onClose }: MetronomeProps) {
  // Metronome state
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [presetName, setPresetName] = useState<string>('');
  const [presets, setPresets] = useState<{id: string, label: string, bpm: number}[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  
  // Refs for managing timing and audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);
  
  // Auth - Try to use auth context, fallback to false if not available
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    // Auth context is not available, continue with isAuthenticated = false
    console.log("Auth context not available, operating in guest mode");
  }
  
  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        toast.error("WebAudio API is not supported in this browser");
      }
    }
    
    return () => {
      stopMetronome();
    };
  }, []);
  
  // Load user's presets
  useEffect(() => {
    if (isAuthenticated) {
      fetchPresets();
    }
  }, [isAuthenticated]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  const fetchPresets = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('metronome_presets')
        .select('id, label, bpm')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPresets(data || []);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };
  
  const startMetronome = () => {
    if (!audioContextRef.current) return;
    
    // Resume audio context if suspended (needed for some browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    setIsPlaying(true);
    lastTickTimeRef.current = Date.now();
    setCurrentBeat(0);
    
    // Start the tick loop
    scheduleTick();
  };
  
  const stopMetronome = () => {
    setIsPlaying(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const scheduleTick = () => {
    if (!isPlaying) return;
    
    const now = Date.now();
    const beatInterval = 60000 / bpm; // milliseconds per beat
    
    // Check if it's time for a tick
    if (!lastTickTimeRef.current || now - lastTickTimeRef.current >= beatInterval) {
      // Play the tick sound
      if (audioContextRef.current) {
        playClick(audioContextRef.current, currentBeat === 0, volume);
      }
      
      // Update state for animation
      setCurrentBeat((prev) => (prev + 1) % 4);
      lastTickTimeRef.current = now;
    }
    
    // Schedule the next check
    timerRef.current = window.setTimeout(scheduleTick, 10);
  };
  
  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    
    // Enforce BPM limits
    if (isNaN(value)) value = 100;
    if (value < 40) value = 40;
    if (value > 240) value = 240;
    
    setBpm(value);
    setActivePreset(null); // Clear active preset when manually changing BPM
  };
  
  const togglePlayback = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };
  
  const savePreset = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to save presets");
      return;
    }
    
    if (!presetName.trim()) {
      toast.error("Please enter a name for this preset");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('metronome_presets')
        .insert({
          label: presetName,
          bpm: bpm
        });
      
      if (error) throw error;
      
      toast.success("Preset saved");
      setPresetName('');
      fetchPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
      toast.error("Failed to save preset");
    }
  };
  
  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('metronome_presets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (activePreset === id) {
        setActivePreset(null);
      }
      
      toast.success("Preset deleted");
      fetchPresets();
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast.error("Failed to delete preset");
    }
  };
  
  const loadPreset = (preset: {id: string, label: string, bpm: number}) => {
    setBpm(preset.bpm);
    setActivePreset(preset.id);
    
    // If already playing, restart with new BPM
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 10);
    }
  };
  
  return (
    <div className="w-full p-2 space-y-4">
      {/* BPM control */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="bpm" className="text-sm font-medium leading-none mb-2 block">
            Tempo: {bpm} BPM
          </label>
          <Input 
            id="bpm"
            type="number"
            min={40}
            max={240}
            value={bpm}
            onChange={handleBpmChange}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={togglePlayback}
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          className="h-10"
        >
          {isPlaying ? (
            <Pause className="mr-1 h-4 w-4" />
          ) : (
            <Play className="mr-1 h-4 w-4" />
          )}
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </div>
      
      {/* Volume slider */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Volume:</span>
        <Slider 
          value={[volume]} 
          max={1} 
          step={0.01}
          onValueChange={([val]) => setVolume(val)} 
          className="flex-1" 
        />
      </div>
      
      {/* Visual indicator */}
      <div className="grid grid-cols-4 gap-2 h-8">
        {[0, 1, 2, 3].map((beat) => (
          <div 
            key={beat}
            className={`
              rounded-full transition-colors
              ${currentBeat === beat && isPlaying 
                ? beat === 0 
                  ? 'bg-primary animate-pulse' 
                  : 'bg-secondary animate-pulse' 
                : 'bg-muted'}
            `}
          />
        ))}
      </div>
      
      {/* Save preset - only show when authenticated */}
      {isAuthenticated && (
        <div className="flex gap-2">
          <Input 
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={savePreset} 
            disabled={!presetName.trim()} 
            variant="outline"
          >
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      )}
      
      {/* Saved presets - only show when authenticated */}
      {isAuthenticated && presets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Saved Presets</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {presets.map((preset) => (
              <div 
                key={preset.id} 
                className={`
                  flex items-center justify-between border rounded p-2 cursor-pointer
                  ${activePreset === preset.id ? 'border-primary bg-primary/10' : ''}
                `}
                onClick={() => loadPreset(preset)}
              >
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="text-sm">{preset.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{preset.bpm} BPM</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-4 w-4" />
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
