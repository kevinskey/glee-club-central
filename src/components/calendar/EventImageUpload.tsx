
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface EventImageUploadProps {
  form: any;
  selectedImage: File | null;
  setSelectedImage: (image: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  isUploading?: boolean;
}

export function EventImageUpload({
  form,
  selectedImage,
  setSelectedImage,
  imagePreview,
  setImagePreview,
  isUploading = false
}: EventImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue('imageUrl', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Event Image</label>
      <FormControl>
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          {!imagePreview ? (
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center border-dashed gap-2"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload event image
              </span>
            </Button>
          ) : (
            <div className="relative">
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-muted">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      </FormControl>
      <p className="text-xs text-muted-foreground">
        Upload an image for the event (optional)
      </p>
    </div>
  );
}
