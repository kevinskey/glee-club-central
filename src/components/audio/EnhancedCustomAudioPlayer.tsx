
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Shuffle, Repeat, BarChart3 } from 'lucide-react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

interface EnhancedCustomAudioPlayerProps {
  className?: string;
}

export function EnhancedCustomAudioPlayer({ className = "" }: EnhancedCustomAudioPlayerProps) {
  const { activePlaylist, playerSettings, trackAnalytics, isLoading } = useMusicPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(playerSettings.default_volume);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(playerSettings.shuffle_mode);
  const [repeatMode, setRepeatMode] = useState<'none' | 'track' | 'playlist'>(playerSettings.repeat_mode);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const playStartTime = useRef<number>(0);

  const currentTrack = activePlaylist?.tracks?.[currentTrackIndex];

  // Update player settings when they change from backend
  useEffect(() => {
    setVolume(playerSettings.default_volume);
    setIsShuffled(playerSettings.shuffle_mode);
    setRepeatMode(playerSettings.repeat_mode);
  }, [playerSettings]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = async () => {
      if (currentTrack) {
        const listenDuration = Math.floor(audio.currentTime - playStartTime.current);
        await trackAnalytics(currentTrack.id, 'complete', listenDuration);
      }
      
      setIsPlaying(false);
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (currentTrackIndex < (activePlaylist?.tracks?.length || 0) - 1 || repeatMode === 'playlist') {
        handleNext();
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
  }, [currentTrackIndex, activePlaylist?.tracks?.length, repeatMode, currentTrack, trackAnalytics]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      const listenDuration = Math.floor(audio.currentTime - playStartTime.current);
      await trackAnalytics(currentTrack.id, 'pause', listenDuration);
    } else {
      audio.play();
      playStartTime.current = audio.currentTime;
      await trackAnalytics(currentTrack.id, 'play');
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

  const handleNext = async () => {
    if (!activePlaylist?.tracks) return;
    
    if (currentTrack) {
      const listenDuration = Math.floor((audioRef.current?.currentTime || 0) - playStartTime.current);
      await trackAnalytics(currentTrack.id, 'skip', listenDuration);
    }

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * activePlaylist.tracks.length);
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= activePlaylist.tracks.length) {
        nextIndex = repeatMode === 'playlist' ? 0 : currentTrackIndex;
      }
    }
    
    if (nextIndex !== currentTrackIndex) {
      setCurrentTrackIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (!activePlaylist?.tracks) return;
    
    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * activePlaylist.tracks.length);
    } else {
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        prevIndex = repeatMode === 'playlist' ? activePlaylist.tracks.length - 1 : 0;
      }
    }
    setCurrentTrackIndex(prevIndex);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'track' | 'playlist')[] = ['none', 'track', 'playlist'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading music player...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentTrack || !activePlaylist) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No playlist available</p>
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
          onContextMenu={(e) => e.preventDefault()}
        />
        
        <div className="flex flex-col space-y-4">
          {/* Current Playlist Info */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {activePlaylist.playlist_name}
            </Badge>
            {playerSettings.show_visualizer && (
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4 text-white" />
                <span className="text-xs text-white/80">Visualizer</span>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack.albumArt ? (
                <img 
                  src={currentTrack.albumArt} 
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
              {currentTrack.featured && (
                <Badge variant="outline" className="mt-1 text-xs border-white/40 text-white">
                  Featured
                </Badge>
              )}
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
              onClick={toggleShuffle}
              className={`text-white hover:bg-white/20 ${isShuffled ? 'bg-white/20' : ''}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
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
              onClick={handleNext}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRepeat}
              className={`text-white hover:bg-white/20 ${repeatMode !== 'none' ? 'bg-white/20' : ''}`}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === 'track' && <span className="text-xs ml-1">1</span>}
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

          {/* Track List Preview */}
          {activePlaylist.tracks.length > 1 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              <div className="text-xs text-white/80 mb-2">
                Track {currentTrackIndex + 1} of {activePlaylist.tracks.length}
              </div>
              {activePlaylist.tracks.slice(0, 3).map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(activePlaylist.tracks.findIndex(t => t.id === track.id))}
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
              {activePlaylist.tracks.length > 3 && (
                <div className="text-xs text-white/60 text-center py-1">
                  +{activePlaylist.tracks.length - 3} more tracks
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
