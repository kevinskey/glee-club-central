
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

  if (publicPlaylists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No public playlists available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Cover Flow Container */}
      <div className="relative h-80 overflow-hidden" ref={containerRef}>
        <div className="flex items-center justify-center h-full perspective-1000">
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
                    translateX(${offset * 120}px) 
                    translateZ(${isActive ? 0 : -100}px)
                    rotateY(${offset * -25}deg)
                    scale(${isActive ? 1 : isAdjacent ? 0.8 : 0.6})
                  `,
                  opacity: isActive ? 1 : isAdjacent ? 0.7 : 0.4,
                }}
                onClick={() => handlePlaylistClick(playlist, index)}
              >
                <Card className={`w-60 h-60 overflow-hidden shadow-2xl transition-shadow duration-300 ${
                  isActive ? 'ring-2 ring-orange-500 shadow-orange-500/20' : ''
                }`}>
                  <div className="relative w-full h-full">
                    {playlist.artwork_url ? (
                      <img 
                        src={playlist.artwork_url} 
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center">
                        <Music className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 shadow-lg"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="text-xs bg-black/50 text-white">
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
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="rounded-full w-10 h-10 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2">
          {publicPlaylists.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="rounded-full w-10 h-10 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Current Playlist Info */}
      {publicPlaylists[currentIndex] && (
        <div className="text-center mt-6 space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {publicPlaylists[currentIndex].name}
          </h3>
          {publicPlaylists[currentIndex].description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {publicPlaylists[currentIndex].description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span>{publicPlaylists[currentIndex].track_count} tracks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(publicPlaylists[currentIndex].duration)}</span>
            </div>
          </div>
          <Button
            onClick={() => onPlaylistSelect(publicPlaylists[currentIndex])}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Playlist
          </Button>
        </div>
      )}
    </div>
  );
}
