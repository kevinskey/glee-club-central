
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Music, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url?: string;
  is_public: boolean;
  created_at: string;
  tracks: any[];
}

interface SoundCloudCoverFlowProps {
  playlists: SoundCloudPlaylist[];
  activePlaylistId?: string;
  onPlaylistSelect: (playlist: SoundCloudPlaylist) => void;
}

export function SoundCloudCoverFlow({ 
  playlists, 
  activePlaylistId, 
  onPlaylistSelect 
}: SoundCloudCoverFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter to show only public playlists with tracks
  const publicPlaylists = playlists.filter(playlist => 
    playlist.is_public && playlist.tracks.length > 0
  );

  const formatDuration = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : publicPlaylists.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < publicPlaylists.length - 1 ? prev + 1 : 0);
  };

  const handlePlaylistClick = (playlist: SoundCloudPlaylist, index: number) => {
    setCurrentIndex(index);
    onPlaylistSelect(playlist);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (publicPlaylists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No public playlists available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Cover Flow Container - Fixed overflow issues */}
      <div 
        className="relative h-80 md:h-96 lg:h-[28rem] select-none" 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          perspective: '1000px',
          overflow: 'visible'
        }}
      >
        <div className="flex items-center justify-center h-full">
          {publicPlaylists.map((playlist, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;
            const isAdjacent = Math.abs(offset) === 1;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <div
                key={playlist.id}
                className={`absolute transition-all duration-500 cursor-pointer ${
                  isActive ? 'z-20' : isAdjacent ? 'z-10' : 'z-0'
                }`}
                style={{
                  transform: `
                    translateX(${offset * (window.innerWidth >= 768 ? 160 : 120)}px) 
                    translateZ(${isActive ? 0 : -100}px)
                    rotateY(${offset * -25}deg)
                    scale(${isActive ? 1 : isAdjacent ? 0.8 : 0.6})
                  `,
                  opacity: isActive ? 1 : isAdjacent ? 0.7 : 0.4,
                }}
                onClick={() => handlePlaylistClick(playlist, index)}
              >
                <Card className={`w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden shadow-2xl transition-shadow duration-300 ${
                  isActive ? 'ring-2 ring-orange-500 shadow-orange-500/20' : ''
                }`}>
                  <div className="relative w-full h-full">
                    {playlist.artwork_url ? (
                      <img 
                        src={playlist.artwork_url} 
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center">
                        <Music className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white/80" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 shadow-lg"
                      >
                        <Play className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ml-1" />
                      </Button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <Badge variant="default" className="text-xs md:text-sm bg-black/50 text-white">
                        {playlist.track_count} tracks
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4 mt-6 md:mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
        
        <div className="flex gap-2">
          {publicPlaylists.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </div>

      {/* Swipe Instruction for Mobile */}
      <div className="text-center mt-4 md:hidden">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Swipe left or right to browse playlists
        </p>
      </div>

      {/* Current Playlist Info */}
      {publicPlaylists[currentIndex] && (
        <div className="text-center mt-6 md:mt-8 space-y-2 md:space-y-3">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
            {publicPlaylists[currentIndex].name}
          </h3>
          {publicPlaylists[currentIndex].description && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md lg:max-w-2xl mx-auto">
              {publicPlaylists[currentIndex].description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3 md:w-4 md:h-4" />
              <span>{publicPlaylists[currentIndex].track_count} tracks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{formatDuration(publicPlaylists[currentIndex].duration)}</span>
            </div>
          </div>
          <Button
            onClick={() => onPlaylistSelect(publicPlaylists[currentIndex])}
            className="mt-4 md:mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Play Playlist
          </Button>
        </div>
      )}
    </div>
  );
}
