import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Wand2, Scissors, Camera, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface PhotoEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelect: (photoUrl: string) => void;
  originalPhoto: string;
  userName?: string;
}

type EnhancementType = 'original' | 'background_removed' | 'auto_crop';

interface EnhancementOption {
  type: EnhancementType;
  label: string;
  description: string;
  icon: React.ReactNode;
  processed: boolean;
  result?: string;
}

export function PhotoEnhancementModal({
  isOpen,
  onClose,
  onPhotoSelect,
  originalPhoto,
  userName = 'User'
}: PhotoEnhancementModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<EnhancementType | null>(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState<EnhancementType>('original');
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOption[]>([
    {
      type: 'original',
      label: 'Original',
      description: 'Keep the photo as captured',
      icon: <Camera className="h-4 w-4" />,
      processed: true,
      result: originalPhoto
    },
    {
      type: 'background_removed',
      label: 'Remove Background',
      description: 'Professional look with transparent background',
      icon: <Scissors className="h-4 w-4" />,
      processed: false
    },
    {
      type: 'auto_crop',
      label: 'Auto Crop',
      description: 'Smart crop for perfect profile photo',
      icon: <RotateCcw className="h-4 w-4" />,
      processed: false
    }
  ]);

  const loadImageFromBase64 = useCallback((base64: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = base64;
    });
  }, []);

  const removeBackground = useCallback(async (imageElement: HTMLImageElement): Promise<string> => {
    try {
      console.log('Starting background removal...');
      
      const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'webgpu',
      });
      
      // Convert HTMLImageElement to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Resize if needed for better performance
      const MAX_SIZE = 512;
      let { width, height } = imageElement;
      
      if (width > MAX_SIZE || height > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imageElement, 0, 0, width, height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Processing with segmentation model...');
      
      const result = await segmenter(imageData);
      
      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Invalid segmentation result');
      }
      
      // Create output canvas
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) throw new Error('Could not get output canvas context');
      
      // Draw original image
      outputCtx.drawImage(canvas, 0, 0);
      
      // Apply mask to remove background
      const outputImageData = outputCtx.getImageData(0, 0, width, height);
      const data = outputImageData.data;
      
      for (let i = 0; i < result[0].mask.data.length; i++) {
        // Invert mask to keep subject, remove background
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }
      
      outputCtx.putImageData(outputImageData, 0, 0);
      
      return outputCanvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Background removal error:', error);
      throw error;
    }
  }, []);

  const autoCropPortrait = useCallback(async (imageElement: HTMLImageElement): Promise<string> => {
    // Simple auto-crop implementation focusing on center and making it square
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    const { width, height } = imageElement;
    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    canvas.width = 400; // Standard profile photo size
    canvas.height = 400;
    
    // Draw cropped and resized image
    ctx.drawImage(imageElement, x, y, size, size, 0, 0, 400, 400);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  const processEnhancement = useCallback(async (type: EnhancementType) => {
    if (type === 'original') return;
    
    try {
      setIsProcessing(true);
      setProcessingType(type);
      
      const imageElement = await loadImageFromBase64(originalPhoto);
      let result: string;
      
      switch (type) {
        case 'background_removed':
          result = await removeBackground(imageElement);
          break;
        case 'auto_crop':
          result = await autoCropPortrait(imageElement);
          break;
        default:
          throw new Error('Unknown enhancement type');
      }
      
      // Update the enhancement options with the result
      setEnhancementOptions(prev => prev.map(option => 
        option.type === type 
          ? { ...option, processed: true, result }
          : option
      ));
      
      toast.success(`${type === 'background_removed' ? 'Background removed' : 'Photo cropped'} successfully!`);
      
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error(`Failed to process enhancement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }, [originalPhoto, loadImageFromBase64, removeBackground, autoCropPortrait]);

  const handleEnhancementSelect = useCallback((type: EnhancementType) => {
    setSelectedEnhancement(type);
    
    // If this enhancement hasn't been processed yet, process it
    const option = enhancementOptions.find(opt => opt.type === type);
    if (option && !option.processed && type !== 'original') {
      processEnhancement(type);
    }
  }, [enhancementOptions, processEnhancement]);

  const handleSavePhoto = useCallback(() => {
    const selectedOption = enhancementOptions.find(opt => opt.type === selectedEnhancement);
    if (selectedOption?.result) {
      onPhotoSelect(selectedOption.result);
      onClose();
    }
  }, [selectedEnhancement, enhancementOptions, onPhotoSelect, onClose]);

  const selectedOption = enhancementOptions.find(opt => opt.type === selectedEnhancement);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Enhance Your Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <Avatar className="h-40 w-40">
              <AvatarImage 
                src={selectedOption?.result || originalPhoto} 
                alt="Enhanced preview" 
              />
              <AvatarFallback className="text-4xl">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Enhancement Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {enhancementOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleEnhancementSelect(option.type)}
                disabled={isProcessing}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedEnhancement === option.type
                    ? 'border-glee-spelman bg-glee-spelman/10'
                    : 'border-border hover:border-glee-spelman/50'
                } ${isProcessing ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {processingType === option.type ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    option.icon
                  )}
                  <span className="font-medium">{option.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                {!option.processed && option.type !== 'original' && (
                  <p className="text-xs text-glee-spelman mt-1">
                    Click to process
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                Processing {processingType === 'background_removed' ? 'background removal' : 'auto-crop'}...
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePhoto}
            disabled={!selectedOption?.result}
            className="bg-glee-spelman hover:bg-glee-spelman/90"
          >
            Use This Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
