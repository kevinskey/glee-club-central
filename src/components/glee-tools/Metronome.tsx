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
  const intervalRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  
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
        audioContextRef.current = createAudioContext();
        console.log('Metronome: Audio context created with state:', audioContextRef.current.state);
      } catch (error) {
        toast.error("WebAudio API is not supported in this browser");
        console.error("Error creating audio context:", error);
      }
    }
    
    // Initialize with a silent sound to unlock audio on iOS
    const unlockAudio = () => {
      if (audioContextRef.current && !isInitializedRef.current) {
        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().then(() => {
            console.log('Audio context resumed');
            isInitializedRef.current = true;
          }).catch(e => console.error('Failed to resume audio context:', e));
        }
        
        // Play silent sound
        try {
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.value = 0.00001; // Nearly silent
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          oscillator.start(0);
          oscillator.stop(audioContextRef.current.currentTime + 0.001);
          isInitializedRef.current = true;
        } catch (e) {
          console.error('Error during audio initialization:', e);
        }
      }
    };
    
    // Initialize immediately and attach to document
    unlockAudio();
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    
    return () => {
      stopMetronome();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
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
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(console.error);
        } catch (e) {
          // Ignore closing errors
        }
      }
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
    if (!audioContextRef.current) {
      console.error('Audio context not available');
      toast.error("Audio system not ready. Please try again.");
      return;
    }
    
    if (audioContextRef.current.state === 'suspended') {
      resumeAudioContext(audioContextRef.current)
        .then(resumed => {
          if (resumed) {
            console.log('Audio context resumed successfully');
            beginMetronome();
          } else {
            console.error('Failed to resume audio context');
            toast.error("Please tap anywhere on the screen to enable audio");
          }
        })
        .catch(err => {
          console.error('Error resuming audio context:', err);
          toast.error("Audio error. Please reload the page.");
        });
    } else {
      beginMetronome();
    }
  };
  
  const beginMetronome = () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    
    // Play initial click
    if (audioContextRef.current) {
      playClick(audioContextRef.current, true, volume);
    }
    
    // Use setInterval for more reliable timing
    const beatInterval = 60000 / bpm; // milliseconds per beat
    
    intervalRef.current = window.setInterval(() => {
      setCurrentBeat(prev => {
        const newBeat = (prev + 1) % 4;
        
        // Play click sound
        if (audioContextRef.current) {
          playClick(audioContextRef.current, newBeat === 0, volume);
        }
        
        return newBeat;
      });
    }, beatInterval);
  };
  
  const stopMetronome = () => {
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
      // Small delay to ensure cleanup
      setTimeout(() => startMetronome(), 50);
    }
  };
  
  const togglePlayback = () => {
    // Check audio context and try to initialize if needed
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = createAudioContext();
      } catch (error) {
        console.error("Failed to create audio context:", error);
        toast.error("Audio system not available");
        return;
      }
    }
    
    // Unlock audio on iOS/Safari with user gesture
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(err => {
        console.error("Failed to resume audio context:", err);
      });
    }
    
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
    
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 50);
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
