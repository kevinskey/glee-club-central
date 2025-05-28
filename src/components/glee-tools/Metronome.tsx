import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAudioContext, resumeAudioContext, playClick } from "@/utils/audioUtils";
import { Play, Pause, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MetronomeProps {
  onClose?: () => void;
}

export function Metronome({ onClose }: MetronomeProps) {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [presetName, setPresetName] = useState<string>('');
  const [presets, setPresets] = useState<{id: string, label: string, bpm: number}[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Auth context
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.log("Metronome: Auth context not available, operating in guest mode");
  }
  
  // Initialize audio context
  const initializeAudio = async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = createAudioContext();
        console.log('Metronome: Audio context created with state:', audioContextRef.current.state);
        
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('Metronome: Audio context resumed');
        }
        
        setIsInitialized(true);
        return true;
      } catch (error) {
        console.error("Metronome: Failed to create audio context:", error);
        toast.error("Audio system not available");
        return false;
      }
    }
    
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('Metronome: Audio context resumed');
      } catch (error) {
        console.error("Metronome: Failed to resume audio context:", error);
        return false;
      }
    }
    
    return true;
  };

  // Initialize on mount
  useEffect(() => {
    initializeAudio();
    
    return () => {
      stopMetronome();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  // Load presets
  useEffect(() => {
    if (isAuthenticated) {
      fetchPresets();
    }
  }, [isAuthenticated]);
  
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

  // Play metronome click
  const playMetronomeClick = async (isAccent: boolean = false) => {
    if (!audioContextRef.current) {
      console.log('Metronome: No audio context available for click');
      return;
    }

    try {
      // Create oscillator and gain node
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.value = isAccent ? 800 : 600;
      gainNode.gain.value = volume * (isAccent ? 1.2 : 1.0);

      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Create envelope
      const now = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      // Play
      oscillator.start(now);
      oscillator.stop(now + 0.1);

      console.log(`Metronome: Played ${isAccent ? 'accent' : 'regular'} click`);
    } catch (error) {
      console.error('Metronome: Error playing click:', error);
    }
  };
  
  const startMetronome = async () => {
    console.log('Metronome: Starting metronome');
    
    // Ensure audio is initialized
    const audioReady = await initializeAudio();
    if (!audioReady) {
      console.error('Metronome: Audio not ready');
      return;
    }

    setIsPlaying(true);
    setCurrentBeat(0);
    
    // Play initial click
    await playMetronomeClick(true);
    
    // Set up interval for subsequent beats
    const intervalMs = (60 / bpm) * 1000;
    
    intervalRef.current = window.setInterval(async () => {
      setCurrentBeat(prev => {
        const newBeat = (prev + 1) % 4;
        
        // Play click sound
        playMetronomeClick(newBeat === 0);
        
        return newBeat;
      });
    }, intervalMs);
    
    console.log(`Metronome: Started at ${bpm} BPM`);
  };
  
  const stopMetronome = () => {
    console.log('Metronome: Stopping metronome');
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    
    if (isNaN(value)) value = 100;
    if (value < 40) value = 40;
    if (value > 240) value = 240;
    
    setBpm(value);
    setActivePreset(null);
    
    // If playing, restart with new BPM
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 100);
    }
  };
  
  const togglePlayback = async () => {
    console.log('Metronome: Toggle playback, currently playing:', isPlaying);
    
    if (isPlaying) {
      stopMetronome();
    } else {
      await startMetronome();
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
    
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 100);
    }
  };

  return (
    <div className="w-full p-2 space-y-4">
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
          disabled={!isInitialized}
        >
          {isPlaying ? (
            <Pause className="mr-1 h-4 w-4" />
          ) : (
            <Play className="mr-1 h-4 w-4" />
          )}
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </div>
      
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
