
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverArt?: string;
  duration?: number;
}

interface CustomAudioPlayerProps {
  tracks: AudioTrack[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  className?: string;
}

export function CustomAudioPlayer({ 
  tracks, 
  currentTrackIndex = 0, 
  onTrackChange,
  className = "" 
}: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentTrackIndex < tracks.length - 1) {
        const nextIndex = currentTrackIndex + 1;
        onTrackChange?.(nextIndex);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length, onTrackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      onTrackChange?.(currentTrackIndex - 1);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      onTrackChange?.(currentTrackIndex + 1);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No tracks available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-gradient-to-r from-glee-spelman to-glee-gold`}>
      <CardContent className="p-6">
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()} // Disable right-click
        />
        
        <div className="flex flex-col space-y-4">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack.coverArt ? (
                <img 
                  src={currentTrack.coverArt} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-white/80 text-sm truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              disabled={currentTrackIndex === 0}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20 h-12 w-12 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              disabled={currentTrackIndex === tracks.length - 1}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 p-2"
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
              className="flex-1"
            />
          </div>

          {/* Track List (if multiple tracks) */}
          {tracks.length > 1 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => onTrackChange?.(index)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="truncate">{track.title}</div>
                  <div className="truncate text-xs opacity-70">{track.artist}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
