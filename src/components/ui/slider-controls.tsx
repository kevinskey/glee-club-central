
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SliderControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  currentSlide: number;
  totalSlides: number;
  onSlideSelect: (index: number) => void;
  autoPlayInterval: number;
  onIntervalChange: (interval: number) => void;
  showControls: boolean;
  onShowControlsChange: (show: boolean) => void;
  showIndicators: boolean;
  onShowIndicatorsChange: (show: boolean) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  preloadAdjacent: boolean;
  onPreloadAdjacentChange: (preload: boolean) => void;
}

export function SliderControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onReset,
  currentSlide,
  totalSlides,
  onSlideSelect,
  autoPlayInterval,
  onIntervalChange,
  showControls,
  onShowControlsChange,
  showIndicators,
  onShowIndicatorsChange,
  aspectRatio,
  onAspectRatioChange,
  preloadAdjacent,
  onPreloadAdjacentChange
}: SliderControlsProps) {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold">Slider Controls</h3>
      
      {/* Playback Controls */}
      <div className="space-y-4">
        <h4 className="font-medium">Playback</h4>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={totalSlides <= 1}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onPlayPause}
            disabled={totalSlides <= 1}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={totalSlides <= 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Slide Selection */}
      <div className="space-y-2">
        <Label>Current Slide: {currentSlide + 1} of {totalSlides}</Label>
        <Select 
          value={currentSlide.toString()} 
          onValueChange={(value) => onSlideSelect(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalSlides }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                Slide {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Auto-play Interval */}
      <div className="space-y-2">
        <Label>Auto-play Interval: {autoPlayInterval / 1000}s</Label>
        <Slider
          value={[autoPlayInterval]}
          onValueChange={(value) => onIntervalChange(value[0])}
          min={1000}
          max={10000}
          step={500}
          className="w-full"
        />
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h4 className="font-medium">Display Options</h4>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show-controls"
            checked={showControls}
            onCheckedChange={onShowControlsChange}
          />
          <Label htmlFor="show-controls">Show Navigation Controls</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-indicators"
            checked={showIndicators}
            onCheckedChange={onShowIndicatorsChange}
          />
          <Label htmlFor="show-indicators">Show Slide Indicators</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="preload-adjacent"
            checked={preloadAdjacent}
            onCheckedChange={onPreloadAdjacentChange}
          />
          <Label htmlFor="preload-adjacent">Preload Adjacent Images</Label>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video (16:9)</SelectItem>
            <SelectItem value="square">Square (1:1)</SelectItem>
            <SelectItem value="wide">Wide (21:9)</SelectItem>
            <SelectItem value="auto">Auto Height</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
