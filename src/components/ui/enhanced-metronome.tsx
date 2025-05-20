
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { audioLogger, createClickBuffer, createAccentClickBuffer, resumeAudioContext } from '@/utils/audioUtils';
import { supabase } from "@/integrations/supabase/client";
import { Square, Play, Plus, Minus } from 'lucide-react';

type MetronomeSize = 'sm' | 'md' | 'lg';

interface EnhancedMetronomeProps {
  size?: MetronomeSize;
  className?: string;
  showControls?: boolean;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function EnhancedMetronome({
  size = 'md',
  className,
  showControls = true,
  audioContextRef
}: EnhancedMetronomeProps) {
  // State
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [presetName, setPresetName] = useState<string>('');
  const [presets, setPresets] = useState<any[]>([]);
  
  // Refs
  const intervalRef = useRef<number | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const accentClickBufferRef = useRef<AudioBuffer | null>(null);

  // Get or create audio context
  const getAudioContext = (): AudioContext => {
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    if (!localAudioContextRef.current) {
      try {
        localAudioContextRef.current = new AudioContext();
      } catch (e) {
        console.error('Failed to create AudioContext:', e);
        throw e;
      }
    }
    
    return localAudioContextRef.current;
  };

  // Setup initial audio buffers
  useEffect(() => {
    try {
      const audioContext = getAudioContext();
      clickBufferRef.current = createClickBuffer(audioContext);
      accentClickBufferRef.current = createAccentClickBuffer(audioContext);
    } catch (error) {
      audioLogger.error('Error setting up metronome audio:', error);
    }
  }, []);

  // Load user's saved presets
  useEffect(() => {
    fetchPresets();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update interval when BPM changes
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm]);

  // Fetch user's saved presets
  const fetchPresets = async () => {
    try {
      const { data, error } = await supabase
        .from('metronome_presets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setPresets(data);
      }
    } catch (error) {
      console.error('Error fetching metronome presets:', error);
    }
  };

  // Save current settings as a preset
  const savePreset = async () => {
    if (!presetName.trim()) {
      return; // Don't save if no name provided
    }
    
    try {
      const { data, error } = await supabase
        .from('metronome_presets')
        .insert({
          label: presetName.trim(),
          bpm: bpm
        });
        
      if (error) throw error;
      
      setPresetName(''); // Clear the input
      fetchPresets(); // Refresh the list
    } catch (error) {
      console.error('Error saving metronome preset:', error);
    }
  };

  // Load a preset
  const loadPreset = (preset: any) => {
    setBpm(preset.bpm);
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 0);
    }
  };

  // Delete a preset
  const deletePreset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the loadPreset
    
    try {
      const { error } = await supabase
        .from('metronome_presets')
        .delete()
        .match({ id });
        
      if (error) throw error;
      
      fetchPresets(); // Refresh the list
    } catch (error) {
      console.error('Error deleting metronome preset:', error);
    }
  };

  // Play a click sound
  const playClick = (isAccent: boolean = false) => {
    try {
      const audioContext = getAudioContext();
      
      if (audioContext.state === 'suspended') {
        resumeAudioContext(audioContext);
      }
      
      // Create a buffer source
      const source = audioContext.createBufferSource();
      
      // Set the buffer based on whether it's an accent
      if (isAccent && accentClickBufferRef.current) {
        source.buffer = accentClickBufferRef.current;
      } else if (clickBufferRef.current) {
        source.buffer = clickBufferRef.current;
      } else {
        return; // No buffer available
      }
      
      // Create a gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Connect the nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play the click
      source.start();
    } catch (error) {
      audioLogger.error('Error playing metronome click:', error);
    }
  };

  // Start the metronome
  const startMetronome = () => {
    try {
      const audioContext = getAudioContext();
      
      // Ensure audio context is running
      if (audioContext.state === 'suspended') {
        resumeAudioContext(audioContext);
      }
      
      // Calculate interval in milliseconds
      const interval = (60 / bpm) * 1000;
      
      setIsPlaying(true);
      setCurrentBeat(0);
      
      // Play first beat immediately
      playClick(true);
      
      // Set up interval for subsequent beats
      intervalRef.current = window.setInterval(() => {
        setCurrentBeat(beat => {
          const nextBeat = (beat + 1) % 4;
          playClick(nextBeat === 0); // Accent on beat 1 (when nextBeat is 0)
          return nextBeat;
        });
      }, interval);
    } catch (error) {
      audioLogger.error('Error starting metronome:', error);
      setIsPlaying(false);
    }
  };

  // Stop the metronome
  const stopMetronome = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  // Toggle play state
  const togglePlay = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  // Adjust BPM
  const adjustBpm = (amount: number) => {
    const newBpm = Math.min(Math.max(bpm + amount, 40), 240);
    setBpm(newBpm);
  };

  // Generate size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-24 w-24';
      case 'lg': return 'h-48 w-48';
      default: return 'h-32 w-32';
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Main metronome visualization */}
      <div className="flex items-center justify-center">
        <div 
          className={cn(
            "relative rounded-full border-2 flex items-center justify-center transition-all",
            getSizeClasses(),
            isPlaying 
              ? "border-glee-purple" 
              : "border-gray-300 dark:border-gray-600"
          )}
        >
          {/* Beat indicator dots */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute h-3 w-3 rounded-full transition-all",
                currentBeat === i && isPlaying
                  ? "bg-glee-purple scale-125" 
                  : "bg-gray-300 dark:bg-gray-600",
                i === 0 && "top-2",
                i === 1 && "right-2",
                i === 2 && "bottom-2",
                i === 3 && "left-2"
              )}
            />
          ))}
          
          {/* BPM display */}
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              isPlaying ? "text-glee-purple" : "text-gray-700 dark:text-gray-300"
            )}>
              {bpm}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">BPM</div>
          </div>
        </div>
      </div>
      
      {showControls && (
        <>
          {/* Play/Stop control */}
          <div className="flex justify-center">
            <Button
              onClick={togglePlay}
              variant={isPlaying ? "default" : "outline"}
              size="lg"
              className={cn(
                "rounded-full h-14 w-14",
                isPlaying ? "bg-glee-purple" : ""
              )}
            >
              {isPlaying ? (
                <Square className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
              <span className="sr-only">
                {isPlaying ? 'Stop' : 'Play'} metronome
              </span>
            </Button>
          </div>
          
          {/* BPM control */}
          <div className="flex items-center gap-2 w-full max-w-xs">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => adjustBpm(-1)}
              className="flex-shrink-0"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease BPM</span>
            </Button>
            
            <div className="flex-grow">
              <input
                type="range"
                min={40}
                max={240}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => adjustBpm(1)}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase BPM</span>
            </Button>
            
            <Input
              type="number"
              min={40}
              max={240}
              value={bpm}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 40 && val <= 240) {
                  setBpm(val);
                }
              }}
              className="w-16"
            />
          </div>
          
          {/* Volume control */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Label htmlFor="volume" className="text-sm">
              Volume: {Math.round(volume * 100)}%
            </Label>
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={(values) => setVolume(values[0])}
            />
          </div>
          
          {/* Save preset */}
          <div className="flex gap-2 w-full max-w-xs">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button onClick={savePreset}>Save</Button>
          </div>
          
          {/* Presets list */}
          {presets.length > 0 && (
            <div className="w-full max-w-xs">
              <Label className="text-sm block mb-2">Saved Presets</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {presets.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="flex justify-between items-center border rounded-md p-2 cursor-pointer hover:bg-accent"
                  >
                    <span>{preset.label}</span>
                    <div>
                      <span className="font-medium">{preset.bpm} BPM</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6"
                        onClick={(e) => deletePreset(preset.id, e)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
