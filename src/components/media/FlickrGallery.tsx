
import React, { useState, useEffect } from 'react';
import { fetchFlickrPhotos } from '@/utils/mediaUtils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface FlickrGalleryProps {
  userId?: string;
  photoCount?: number;
  className?: string;
}

export function FlickrGallery({ userId = '129581018@N02', photoCount = 6, className }: FlickrGalleryProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const flickrPhotos = await fetchFlickrPhotos(userId, photoCount);
        setPhotos(flickrPhotos);
      } catch (err) {
        console.error('Error loading Flickr photos:', err);
        setError('Failed to load photos from Flickr');
      } finally {
        setLoading(false);
      }
    };
    
    loadPhotos();
  }, [userId, photoCount]);
  
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
        <p className="text-sm mt-2">Please check your connection and try again later.</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: photoCount }).map((_, i) => (
            <div key={`skeleton-${i}`} className="rounded-xl overflow-hidden shadow-md">
              <AspectRatio ratio={4/3}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <div className="p-3 bg-white dark:bg-gray-800">
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : photos.length > 0 ? (
          // Actual photos
          photos.map((photo) => (
            <a 
              key={photo.id}
              href={photo.flickrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <AspectRatio ratio={4/3}>
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ExternalLink className="text-white h-8 w-8" />
                </div>
              </AspectRatio>
              <div className="p-3 bg-white dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{photo.title || 'Spelman Glee Club Photo'}</p>
              </div>
            </a>
          ))
        ) : (
          // No photos available
          <div className="col-span-full text-center py-6 text-gray-500">
            <p>No photos available from Flickr.</p>
            <a 
              href="https://www.flickr.com/photos/spelmanglee/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-glee-purple hover:text-glee-accent mt-2 inline-block"
            >
              Visit our Flickr Gallery
            </a>
          </div>
        )}
      </div>
      
      <div className="text-center mt-4">
        <a 
          href="https://www.flickr.com/photos/spelmanglee/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-glee-purple hover:text-glee-accent"
        >
          View more photos on Flickr
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
