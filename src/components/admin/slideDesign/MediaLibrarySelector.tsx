
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaFile } from '@/types/media';
import { Image, Search } from 'lucide-react';

interface MediaLibrarySelectorProps {
  onSelectMedia: (mediaUrl: string, mediaId: string) => void;
  triggerText?: string;
}

export function MediaLibrarySelector({ onSelectMedia, triggerText = "Select from Media Library" }: MediaLibrarySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredMediaFiles, isLoading } = useMediaLibrary();

  const imageFiles = filteredMediaFiles.filter(file => 
    file.file_type.startsWith('image/') &&
    (searchTerm === '' || file.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectMedia = (media: MediaFile) => {
    onSelectMedia(media.file_url, media.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full text-xs sm:text-sm">
          <Image className="h-4 w-4 mr-2" />
          <span className="truncate">{triggerText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Select Image from Media Library</DialogTitle>
          <DialogDescription className="text-sm">
            Choose an image from your media library to use in your slide design
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {imageFiles.map((media) => (
                <div
                  key={media.id}
                  className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectMedia(media)}
                >
                  <img
                    src={media.file_url}
                    alt={media.title}
                    className="w-full h-20 sm:h-32 object-cover"
                  />
                  <div className="p-1 sm:p-2">
                    <p className="text-xs sm:text-sm font-medium truncate">{media.title}</p>
                    {media.description && (
                      <p className="text-xs text-gray-500 truncate">{media.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && imageFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Image className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">No images found in media library</p>
              {searchTerm && (
                <p className="text-xs sm:text-sm">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
