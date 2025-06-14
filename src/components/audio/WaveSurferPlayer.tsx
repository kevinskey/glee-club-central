import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  Volume2 
} from 'lucide-react';
import { AudioFile } from '@/types/audio';

interface WaveSurferPlayerProps {
  audio: AudioFile;
  className?: string;
}

export const WaveSurferPlayer: React.FC<WaveSurferPlayerProps> = ({ 
  audio, 
  className = "" 
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const speedPresets = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 }
  ];

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4A90E2',
      progressColor: '#2563eb',
      cursorColor: '#1d4ed8',
      barWidth: 3,
      barRadius: 2,
      barGap: 1,
      minPxPerSec: 50,
      fillParent: true,
    });

    // Load audio
    wavesurfer.current.load(audio.file_url);
    setIsLoading(true);

    // Event listeners
    wavesurfer.current.on('ready', () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
      setIsLoading(false);
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });

    wavesurfer.current.on('interaction', () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });

    wavesurfer.current.on('timeupdate', () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('finish', () => setIsPlaying(false));

    // Set initial volume
    wavesurfer.current.setVolume(volume);

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audio.file_url]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const handleSkipBack = () => {
    if (wavesurfer.current) {
      const currentTime = wavesurfer.current.getCurrentTime();
      wavesurfer.current.seekTo(Math.max(0, currentTime - 10) / duration);
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer.current) {
      const currentTime = wavesurfer.current.getCurrentTime();
      wavesurfer.current.seekTo(Math.min(duration, currentTime + 10) / duration);
    }
  };

  const handleRestart = () => {
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(newVolume);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(speed);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{audio.title}</h3>
          {audio.description && (
            <p className="text-sm text-gray-600">{audio.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {speedPresets.map((preset) => (
            <Button
              key={preset.value}
              variant={playbackRate === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleSpeedChange(preset.value)}
              className="text-xs px-2 py-1"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Waveform */}
      <div className="relative">
        <div 
          ref={waveformRef} 
          className="w-full h-20 bg-gray-50 rounded"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Loading audio...</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRestart}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSkipBack}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            onClick={handlePlayPause}
            variant="default"
            size="sm"
            disabled={isLoading}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleSkipForward}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-500 min-w-[100px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Volume2 className="h-4 w-4 text-gray-500" />
          <div className="w-20">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
          <span className="text-xs text-gray-500 min-w-[30px]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
