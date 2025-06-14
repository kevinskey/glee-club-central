
import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Download, Loader2 } from 'lucide-react';

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
        height: 60,
        normalize: true,
        backend: 'WebAudio',
        interact: true,
      });

      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current?.getDuration() || 0);
        setIsLoaded(true);
        setIsLoading(false);
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
      });

      wavesurfer.current.on('click', () => {
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

      await wavesurfer.current.load(audioUrl);
      wavesurfer.current.setVolume(volume);
    } catch (error) {
      console.error('Error initializing WaveSurfer:', error);
      setIsLoading(false);
    }
  }, [audioUrl, volume]);

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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="space-y-4">
          {/* Track Info */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {displayName}
              </p>
              {metadata && (
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {metadata.bpm && <span>BPM: {metadata.bpm}</span>}
                  {metadata.key && <span>Key: {metadata.key}</span>}
                  {metadata.duration && <span>Duration: {metadata.duration}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Waveform */}
          <div className="relative">
            {!isLoaded && !isLoading && (
              <div 
                className="h-[60px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={initializeWaveSurfer}
                onMouseEnter={!autoLoad ? initializeWaveSurfer : undefined}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to load waveform
                </p>
              </div>
            )}
            {isLoading && (
              <div className="h-[60px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            )}
            <div 
              ref={waveformRef} 
              className={`${!isLoaded ? 'hidden' : ''} rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800`}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlayPause}
                disabled={isLoading}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white h-12 w-12 rounded-full p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-1" />
                )}
              </Button>

              <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
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
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-gray-600"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Volume Control */}
          <div className="sm:hidden flex items-center gap-2">
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
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
