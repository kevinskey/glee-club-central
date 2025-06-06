
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Settings,
  RotateCcw,
  Zap,
  Clock,
  Shuffle
} from 'lucide-react';

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  speed: number;
  transition: string;
  autoPlay: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSlideChange: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onTransitionChange: (transition: string) => void;
  onAutoPlayToggle: (autoPlay: boolean) => void;
  onReset: () => void;
}

const transitionOptions = [
  { value: 'fade', label: 'Fade' },
  { value: 'slide', label: 'Slide' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'none', label: 'None' }
];

export function SlideControls({
  currentSlide,
  totalSlides,
  isPlaying,
  speed,
  transition,
  autoPlay,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSlideChange,
  onSpeedChange,
  onTransitionChange,
  onAutoPlayToggle,
  onReset
}: SlideControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Slide Controls
          <Badge variant="outline" className="ml-auto">
            {currentSlide + 1} of {totalSlides}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
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
            onClick={isPlaying ? onPause : onPlay}
            disabled={totalSlides <= 1}
            className="h-12 w-12"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
            title="Reset to first slide"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Progress */}
        {totalSlides > 1 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Slide Position</Label>
            <Slider
              value={[currentSlide]}
              onValueChange={([value]) => onSlideChange(value)}
              max={totalSlides - 1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slide 1</span>
              <span>Slide {totalSlides}</span>
            </div>
          </div>
        )}

        {/* AutoPlay Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <Label htmlFor="autoplay">Auto Play</Label>
          </div>
          <Switch
            id="autoplay"
            checked={autoPlay}
            onCheckedChange={onAutoPlayToggle}
          />
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <Label className="text-sm font-medium">
              Speed: {speed / 1000}s per slide
            </Label>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={1000}
            max={10000}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast (1s)</span>
            <span>Slow (10s)</span>
          </div>
        </div>

        {/* Advanced Controls Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Controls
        </Button>

        {/* Advanced Controls */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Transition Effect</Label>
              <Select value={transition} onValueChange={onTransitionChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transitionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Speed Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Speed Presets</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSpeedChange(2000)}
                  className={speed === 2000 ? 'bg-primary text-primary-foreground' : ''}
                >
                  Fast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSpeedChange(5000)}
                  className={speed === 5000 ? 'bg-primary text-primary-foreground' : ''}
                >
                  Normal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSpeedChange(8000)}
                  className={speed === 8000 ? 'bg-primary text-primary-foreground' : ''}
                >
                  Slow
                </Button>
              </div>
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={isPlaying ? "default" : "secondary"}>
                  {isPlaying ? "Playing" : "Paused"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transition:</span>
                <span className="capitalize">{transition}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
