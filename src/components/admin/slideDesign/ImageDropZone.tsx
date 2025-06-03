
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageDropZoneProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
}

export function ImageDropZone({ onImageUpload, currentImage, onRemoveImage }: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create a URL for the uploaded file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
        toast.success('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (currentImage) {
    return (
      <Card className="relative group">
        <CardContent className="p-2">
          <img
            src={currentImage}
            alt="Uploaded background"
            className="w-full h-32 object-cover rounded"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                onClick={handleButtonClick}
                size="sm"
                variant="secondary"
              >
                <Upload className="h-3 w-3 mr-1" />
                Replace
              </Button>
              {onRemoveImage && (
                <Button
                  onClick={onRemoveImage}
                  size="sm"
                  variant="destructive"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragOver
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <CardContent className="p-6 text-center">
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Drop images here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse files
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="h-3 w-3 mr-1" />
            Choose Image
          </Button>
        </div>
      </CardContent>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </Card>
  );
}
