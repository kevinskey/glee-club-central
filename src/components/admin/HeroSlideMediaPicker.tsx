
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MediaPicker } from '@/components/media/MediaPicker';
import { Image, Plus } from 'lucide-react';

interface HeroSlideMediaPickerProps {
  currentImageUrl?: string;
  onImageSelect: (mediaData: { id: string; file_type: string; file_url: string }) => void;
  trigger?: React.ReactNode;
}

export const HeroSlideMediaPicker: React.FC<HeroSlideMediaPickerProps> = ({
  currentImageUrl,
  onImageSelect,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMediaSelect = (data: string | { id: string; file_type: string; file_url: string }) => {
    console.log('HeroSlideMediaPicker: Media selected:', data);
    
    if (typeof data === 'object' && data.id && data.file_url) {
      console.log('HeroSlideMediaPicker: Calling onImageSelect with:', data);
      onImageSelect(data);
      setIsOpen(false);
    } else {
      console.error('HeroSlideMediaPicker: Invalid data format received:', data);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" type="button">
      <Image className="h-4 w-4 mr-2" />
      {currentImageUrl ? 'Change Image' : 'Select Image'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Hero Slide Image (Double-click to select)</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <MediaPicker
            isOpen={true}
            onClose={() => setIsOpen(false)}
            onSelect={handleMediaSelect}
            allowedTypes={['image']}
            showUpload={true}
            returnMediaObject={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
