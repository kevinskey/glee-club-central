
import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, RotateCcw, Loader2, Music } from 'lucide-react';

interface WaveSurferPlayerProps {
  audioUrl: string;
  title: string;
  artist?: string;
  composer?: string;
  metadata?: {
    bpm?: number;
    key?: string;
    duration?: string;
  };
  className?: string;
  autoLoad?: boolean;
}

export function WaveSurferPlayer({ 
  audioUrl, 
  title, 
  artist, 
  composer, 
  metadata,
  className = "",
  autoLoad = false 
}: WaveSurferPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const initializeWaveSurfer = useCallback(async () => {
    if (!waveformRef.current || wavesurfer.current) return;

    setIsLoading(true);
    
    try {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#e5e7eb',
        progressColor: '#f97316',
        cursorColor: '#f97316',
        barWidth: 2,
        barRadius: 1,
        height: 80,
        normalize: true,
        backend: 'WebAudio',
        interact: true,
        hideScrollbar: true,
        barGap: 1,
        minPxPerSec: 50,
        fillParent: true,
        pixelRatio: window.devicePixelRatio || 1,
      });

      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current?.getDuration() || 0);
        setIsLoaded(true);
        setIsLoading(false);
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
      });

      wavesurfer.current.on('interaction', () => {
        setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
      });

      wavesurfer.current.on('play', () => {
        setIsPlaying(true);
      });

      wavesurfer.current.on('pause', () => {
        setIsPlaying(false);
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      wavesurfer.current.on('error', (error) => {
        console.error('WaveSurfer error:', error);
        setIsLoading(false);
      });

      await wavesurfer.current.load(audioUrl);
      wavesurfer.current.setVolume(volume);
      wavesurfer.current.setPlaybackRate(playbackRate);
    } catch (error) {
      console.error('Error initializing WaveSurfer:', error);
      setIsLoading(false);
    }
  }, [audioUrl, volume, playbackRate]);

  useEffect(() => {
    if (autoLoad) {
      initializeWaveSurfer();
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [autoLoad, initializeWaveSurfer]);

  const handlePlayPause = async () => {
    if (!wavesurfer.current && !isLoaded) {
      await initializeWaveSurfer();
    }
    
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(false);
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (wavesurfer.current) {
      if (isMuted) {
        wavesurfer.current.setVolume(volume);
        setIsMuted(false);
      } else {
        wavesurfer.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleSkipBack = () => {
    if (wavesurfer.current) {
      const newTime = Math.max(0, currentTime - 10);
      wavesurfer.current.seekTo(newTime / duration);
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer.current) {
      const newTime = Math.min(duration, currentTime + 10);
      wavesurfer.current.seekTo(newTime / duration);
    }
  };

  const handleRestart = () => {
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(0);
    }
  };

  const handlePlaybackRateChange = (value: number[]) => {
    const newRate = value[0];
    setPlaybackRate(newRate);
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(newRate);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayName = artist || composer || 'Unknown Artist';

  return (
    <Card className={`${className} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Track Info */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {displayName}
              </p>
              {metadata && (
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {metadata.bpm && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">BPM: {metadata.bpm}</span>}
                  {metadata.key && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Key: {metadata.key}</span>}
                  {metadata.duration && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Duration: {metadata.duration}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Music className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          {/* Waveform */}
          <div className="relative">
            {!isLoaded && !isLoading && (
              <div 
                className="h-[80px] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300"
                onClick={initializeWaveSurfer}
                onMouseEnter={!autoLoad ? initializeWaveSurfer : undefined}
              >
                <div className="text-center">
                  <Music className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to load waveform
                  </p>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="h-[80px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading waveform...</p>
                </div>
              </div>
            )}
            <div 
              ref={waveformRef} 
              className={`${!isLoaded ? 'hidden' : ''} rounded-lg overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700`}
            />
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              disabled={!isLoaded}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipBack}
              disabled={!isLoaded}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={handlePlayPause}
              disabled={isLoading}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white h-14 w-14 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipForward}
              disabled={!isLoaded}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono min-w-[80px] text-center">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="space-y-4">
            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="flex-1">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
                />
              </div>
              <span className="text-xs text-gray-500 min-w-[40px]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Playback Speed Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">Speed:</span>
              <div className="flex-1">
                <Slider
                  value={[playbackRate]}
                  min={0.25}
                  max={2}
                  step={0.25}
                  onValueChange={handlePlaybackRateChange}
                  className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
                />
              </div>
              <span className="text-xs text-gray-500 min-w-[40px]">
                {playbackRate}x
              </span>
            </div>

            {/* Speed Presets */}
            <div className="flex items-center justify-center gap-2">
              {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                <Button
                  key={speed}
                  variant={playbackRate === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePlaybackRateChange([speed])}
                  className={`text-xs ${
                    playbackRate === speed 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
