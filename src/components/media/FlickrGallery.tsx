
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FlickrGalleryProps {
  userId?: string;
  photoCount?: number;
}

export const FlickrGallery: React.FC<FlickrGalleryProps> = ({ 
  userId, 
  photoCount = 12 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flickr Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Flickr integration coming soon...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlickrGallery;
