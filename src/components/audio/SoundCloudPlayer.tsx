
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Heart, 
  Share2, 
  Download,
  MoreHorizontal,
  Repeat,
  Shuffle
} from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { PlaylistSidebar } from './PlaylistSidebar';
import { CommentSection } from './CommentSection';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  waveformData?: number[];
  coverArt?: string;
  likes: number;
  plays: number;
  isLiked?: boolean;
  genre?: string;
  uploadDate: string;
  description?: string;
}

interface SoundCloudPlayerProps {
  tracks: Track[];
  currentTrackIndex?: number;
  onTrackChange?: (trackIndex: number) => void;
}

export function SoundCloudPlayer({ 
  tracks, 
  currentTrackIndex = 0, 
  onTrackChange 
}: SoundCloudPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'track' | 'playlist'>('none');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleNext = () => {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      nextIndex = repeatMode === 'playlist' ? 0 : currentTrackIndex;
    }
    if (nextIndex !== currentTrackIndex) {
      onTrackChange?.(nextIndex);
    }
  };

  const handlePrevious = () => {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeatMode === 'playlist' ? tracks.length - 1 : 0;
    }
    onTrackChange?.(prevIndex);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLike = () => {
    // Implement like functionality
    console.log('Toggle like for track:', currentTrack.id);
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.share?.({
      title: currentTrack.title,
      text: `Listen to ${currentTrack.title} by ${currentTrack.artist}`,
      url: window.location.href
    });
  };

  if (!currentTrack) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4">
      {/* Main Player */}
      <div className="flex-1">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
                  <img 
                    src={currentTrack.coverArt || "/placeholder.svg"} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentTrack.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{currentTrack.artist[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{currentTrack.artist}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{currentTrack.plays.toLocaleString()} plays</span>
                    <span>{currentTrack.likes.toLocaleString()} likes</span>
                    {currentTrack.genre && <Badge variant="secondary">{currentTrack.genre}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleLike}
                  className={currentTrack.isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Waveform */}
            <WaveformVisualizer 
              waveformData={currentTrack.waveformData || []}
              currentTime={currentTime}
              duration={currentTrack.duration}
              onSeek={handleSeek}
            />
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
                className={isShuffled ? "text-orange-500" : ""}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handlePlayPause} 
                size="lg" 
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setRepeatMode(
                  repeatMode === 'none' ? 'track' : 
                  repeatMode === 'track' ? 'playlist' : 'none'
                )}
                className={repeatMode !== 'none' ? "text-orange-500" : ""}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode === 'track' && <span className="text-xs ml-1">1</span>}
              </Button>
            </div>
            
            {/* Time and Volume */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center gap-2 flex-1 mx-4">
                <Volume2 className="w-4 h-4" />
                <Slider
                  value={[volume]}
                  max={1}
                  min={0}
                  step={0.01}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-24"
                />
              </div>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
            
            {/* Description */}
            {currentTrack.description && (
              <div className="text-sm text-muted-foreground">
                <p>{currentTrack.description}</p>
              </div>
            )}
            
            {/* Toggle Comments */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => setShowComments(!showComments)}
              >
                Comments ({Math.floor(Math.random() * 50)})
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                Playlist ({tracks.length})
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-6">
            <CommentSection trackId={currentTrack.id} />
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      {showPlaylist && (
        <div className="lg:w-80">
          <PlaylistSidebar 
            tracks={tracks} 
            currentTrackIndex={currentTrackIndex}
            onTrackSelect={onTrackChange}
          />
        </div>
      )}
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setCurrentTime(0);
          }
        }}
      />
    </div>
  );
}
