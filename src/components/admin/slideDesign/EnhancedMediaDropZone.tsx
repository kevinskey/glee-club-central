
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image as ImageIcon, Video, X, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedMediaDropZoneProps {
  onImageUpload: (imageUrl: string) => void;
  onVideoUpload: (videoUrl: string) => void;
  onAIGenerate: (type: 'image' | 'video', prompt: string) => void;
  currentMedia?: string;
  mediaType?: 'image' | 'video';
  onRemoveMedia?: () => void;
}

export function EnhancedMediaDropZone({ 
  onImageUpload, 
  onVideoUpload,
  onAIGenerate,
  currentMedia, 
  mediaType,
  onRemoveMedia 
}: EnhancedMediaDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (imageFile) {
      handleFileUpload(imageFile, 'image');
    } else if (videoFile) {
      handleFileUpload(videoFile, 'video');
    } else {
      toast.error('Please drop an image or video file');
    }
  };

  const handleFileUpload = (file: File, type: 'image' | 'video') => {
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        if (type === 'image') {
          onImageUpload(e.target.result as string);
        } else {
          onVideoUpload(e.target.result as string);
        }
        toast.success(`${type} uploaded successfully`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAIGeneration = async (type: 'image' | 'video') => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    try {
      await onAIGenerate(type, aiPrompt);
      toast.success(`AI ${type} generated successfully`);
      setAiPrompt('');
    } catch (error) {
      toast.error(`Failed to generate AI ${type}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (currentMedia) {
    return (
      <Card className="relative group">
        <CardContent className="p-2">
          {mediaType === 'video' ? (
            <video
              src={currentMedia}
              className="w-full h-32 object-cover rounded"
              controls
              muted
            />
          ) : (
            <img
              src={currentMedia}
              alt="Uploaded media"
              className="w-full h-32 object-cover rounded"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                onClick={() => mediaType === 'video' ? videoInputRef.current?.click() : fileInputRef.current?.click()}
                size="sm"
                variant="secondary"
              >
                <Upload className="h-3 w-3 mr-1" />
                Replace
              </Button>
              {onRemoveMedia && (
                <Button
                  onClick={onRemoveMedia}
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
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
          className="hidden"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="ai">AI Generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragOver
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-6 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Drop images or videos here</p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Generation Prompt</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want to generate..."
                  className="w-full p-2 border rounded-md text-sm resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAIGeneration('image')}
                  disabled={isGenerating}
                  size="sm"
                  className="flex-1"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Generate Image
                </Button>
                <Button
                  onClick={() => handleAIGeneration('video')}
                  disabled={isGenerating}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Generate Video
                </Button>
              </div>
              
              {isGenerating && (
                <div className="text-center text-sm text-muted-foreground">
                  Generating content with AI...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
        className="hidden"
      />
    </div>
  );
}
