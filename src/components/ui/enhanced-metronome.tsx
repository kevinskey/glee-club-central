
import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { useMetronomeEngine, TimeSignature, Subdivision, SoundType } from '@/components/ui/metronome-engine';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pause, Play } from 'lucide-react';

export interface MetronomeProps {
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg';
  audioContextRef?: MutableRefObject<AudioContext | null>;
}

export function EnhancedMetronome({
  showControls = false,
  size = 'md',
  audioContextRef
}: MetronomeProps) {
  // State for metronome settings
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [subdivision, setSubdivision] = useState<Subdivision>('quarter');
  const [soundType, setSoundType] = useState<SoundType>('click');
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  
  // Visual beat indicators
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSubBeat, setCurrentSubBeat] = useState(0);
  
  // Get the number of beats from time signature
  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };
  
  // Get the number of subdivisions per beat
  const getSubdivisionsPerBeat = () => {
    switch (subdivision) {
      case 'quarter': return 1;
      case 'eighth': return 2;
      case 'triplet': return 3;
      case 'sixteenth': return 4;
      default: return 1;
    }
  };
  
  // Handler for tick events from the metronome engine
  const handleTick = (beat: number, subBeat: number) => {
    setCurrentBeat(beat);
    setCurrentSubBeat(subBeat);
  };
  
  // Initialize metronome engine
  const { audioLoaded, audioError, resumeAudioSystem } = useMetronomeEngine({
    bpm,
    isPlaying,
    volume,
    timeSignature,
    subdivision,
    soundType,
    accentFirstBeat,
    onTick: handleTick,
    audioContextRef,
  });
  
  // Play/pause handler with auto-resume for mobile browsers
  const handlePlayPause = () => {
    if (!isPlaying) {
      // Try to resume the audio context (needed for iOS)
      resumeAudioSystem();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Generate an array of visual beat indicators
  const beatsArray = Array.from({ length: getBeatsPerMeasure() });
  const subBeatsPerBeat = getSubdivisionsPerBeat();
  
  // Size-based styles
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'text-xs',
          beatContainer: 'gap-1',
          beat: 'w-3 h-3 md:w-4 md:h-4',
          subBeat: 'w-2 h-2 md:w-2.5 md:h-2.5',
          controls: 'space-y-2',
          slider: 'h-4',
        };
      case 'lg':
        return {
          container: 'text-base',
          beatContainer: 'gap-3',
          beat: 'w-6 h-6 md:w-8 md:h-8',
          subBeat: 'w-4 h-4 md:w-5 md:h-5',
          controls: 'space-y-4',
          slider: 'h-6',
        };
      default: // md
        return {
          container: 'text-sm',
          beatContainer: 'gap-2',
          beat: 'w-5 h-5 md:w-6 md:h-6',
          subBeat: 'w-3 h-3 md:w-4 md:h-4',
          controls: 'space-y-3',
          slider: 'h-5',
        };
    }
  };
  
  const classes = getSizeClasses();
  
  // Stop playing when component unmounts
  useEffect(() => {
    return () => {
      setIsPlaying(false);
    };
  }, []);
  
  // Display loading state or error
  if (!audioLoaded) {
    return (
      <div className="text-center p-4">
        {audioError ? (
          <div className="text-red-500">{audioError}</div>
        ) : (
          <div className="animate-pulse">Loading metronome sounds...</div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`w-full ${classes.container}`}>
      {/* Beat visualization */}
      <div className="flex justify-center mb-4">
        <div className={`flex items-center ${classes.beatContainer}`}>
          {beatsArray.map((_, beatIndex) => (
            <div key={beatIndex} className="flex flex-col items-center gap-1">
              {/* Main beat */}
              <div 
                className={`${classes.beat} rounded-full ${
                  beatIndex === currentBeat && currentSubBeat === 0
                    ? 'bg-primary'
                    : 'bg-muted'
                } transition-colors`}
              />
              
              {/* Sub-beats (if any) */}
              {subBeatsPerBeat > 1 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: subBeatsPerBeat - 1 }).map((_, subIndex) => (
                    <div
                      key={subIndex}
                      className={`${classes.subBeat} rounded-full ${
                        beatIndex === currentBeat && subIndex + 1 === currentSubBeat
                          ? 'bg-primary/60'
                          : 'bg-muted/60'
                      } transition-colors`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* BPM display and play/pause button */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-bold">{bpm} BPM</div>
        <Button 
          onClick={handlePlayPause} 
          variant="outline"
          size="icon"
          className={isPlaying ? "bg-primary/10 hover:bg-primary/20" : ""}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* BPM slider */}
      <Slider
        value={[bpm]}
        min={40}
        max={240}
        step={1}
        onValueChange={(value) => setBpm(value[0])}
        className={`mb-4 ${classes.slider}`}
      />
      
      {/* Additional controls (only shown if showControls is true) */}
      {showControls && (
        <div className={`${classes.controls}`}>
          {/* Time signature selector */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs block mb-1">Time Signature</label>
              <Select
                value={timeSignature}
                onValueChange={(value) => setTimeSignature(value as TimeSignature)}
              >
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
            
            <div>
              <label className="text-xs block mb-1">Subdivision</label>
              <Select
                value={subdivision}
                onValueChange={(value) => setSubdivision(value as Subdivision)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="eighth">Eighth</SelectItem>
                  <SelectItem value="triplet">Triplet</SelectItem>
                  <SelectItem value="sixteenth">16th</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Sound selector */}
            <div>
              <label className="text-xs block mb-1">Sound</label>
              <Select
                value={soundType}
                onValueChange={(value) => setSoundType(value as SoundType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Click" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="beep">Beep</SelectItem>
                  <SelectItem value="woodblock">Woodblock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Volume slider */}
            <div>
              <label className="text-xs block mb-1">Volume</label>
              <Slider
                value={[volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
              />
            </div>
          </div>
          
          {/* Accent first beat checkbox */}
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox 
              id="accent" 
              checked={accentFirstBeat} 
              onCheckedChange={(checked) => setAccentFirstBeat(checked === true)}
            />
            <label 
              htmlFor="accent" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Accent first beat
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
