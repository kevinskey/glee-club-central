import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Camera, X, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelect: (photoUrl: string) => void;
  currentPhoto?: string;
  userName?: string;
}

export function PhotoUploadModal({
  isOpen,
  onClose,
  onPhotoSelect,
  currentPhoto,
  userName = 'User'
}: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhoto || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    console.log('🎥 Starting camera...');
    setIsCameraLoading(true);
    setIsVideoReady(false);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('✅ Camera stream obtained successfully');
      setStream(mediaStream);
      setIsCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('📹 Video source set to element');
        
        // Add event listener for when video can play
        videoRef.current.addEventListener('canplay', () => {
          console.log('🎬 Video can play event fired');
        });
      }
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      setIsCameraLoading(false);
      setIsCameraMode(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          toast.error('No camera found on this device.');
        } else {
          toast.error(`Camera error: ${error.message}`);
        }
      } else {
        toast.error('Unable to access camera. Please check permissions.');
      }
    }
  }, []);

  const handleVideoReady = useCallback(() => {
    console.log('🎯 Video loadeddata event fired');
    
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('📐 Video dimensions:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        currentTime: video.currentTime
      });
      
      // Only set ready if video has valid dimensions
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log('✅ Video is ready for capture');
        setIsVideoReady(true);
        setIsCameraLoading(false);
      } else {
        console.log('⚠️ Video dimensions are still zero, waiting...');
        // Try again after a short delay
        setTimeout(() => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            console.log('✅ Video ready after retry');
            setIsVideoReady(true);
            setIsCameraLoading(false);
          }
        }, 500);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Track stopped:', track.kind);
      });
      setStream(null);
    }
    setIsCameraMode(false);
    setIsVideoReady(false);
    setIsCameraLoading(false);
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    console.log('📸 Capture photo button clicked');
    console.log('🔍 Current state:', {
      isVideoReady,
      isCapturing,
      videoElement: !!videoRef.current,
      canvasElement: !!canvasRef.current
    });

    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Missing video or canvas element');
      toast.error('Camera not properly initialized. Please try again.');
      return;
    }

    if (!isVideoReady) {
      console.error('❌ Video not ready for capture');
      toast.error('Video not ready. Please wait for the camera to initialize.');
      return;
    }

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // Double-check video dimensions before capture
      console.log('📏 Pre-capture video check:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState
      });

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video dimensions are invalid');
      }

      console.log('🎨 Drawing to canvas...');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      console.log('🖼️ Converting canvas to blob...');
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          console.log('💾 Blob created:', blob ? `${blob.size} bytes` : 'null');
          resolve(blob);
        }, 'image/jpeg', 0.8);
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      console.log('✅ Photo captured successfully, creating file...');
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        console.log('🖼️ Preview URL set successfully');
      };
      reader.readAsDataURL(file);
      
      stopCamera();
      toast.success('Photo captured successfully!');
      
    } catch (error) {
      console.error('❌ Error capturing photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  }, [isVideoReady, stopCamera]);

  const retryCamera = useCallback(() => {
    console.log('🔄 Retrying camera setup...');
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  }, [stopCamera, startCamera]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select or capture a photo first');
      return;
    }

    setIsUploading(true);
    try {
      // Convert file to base64 for now (in a real app, you'd upload to storage)
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        onPhotoSelect(base64String);
        toast.success('Photo uploaded successfully');
        onClose();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onPhotoSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {isCameraMode ? 'Take Photo' : 'Upload Profile Photo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Camera View */}
            {isCameraMode ? (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      onLoadedData={handleVideoReady}
                      className="w-full max-w-sm rounded-lg"
                      style={{ display: isCameraLoading ? 'none' : 'block' }}
                    />
                    {isCameraLoading && (
                      <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-glee-spelman" />
                        <p className="text-sm text-muted-foreground">Initializing camera...</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Debug info for troubleshooting */}
                {isVideoReady && (
                  <div className="text-xs text-center text-muted-foreground">
                    Camera ready for capture
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => {
                      console.log('🔘 Capture button clicked, calling capturePhoto...');
                      capturePhoto();
                    }}
                    size="lg" 
                    className="bg-glee-spelman hover:bg-glee-spelman/90"
                    disabled={!isVideoReady || isCapturing}
                  >
                    {isCapturing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Capturing...
                      </>
                    ) : (
                      <>
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Photo
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={retryCamera}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
                
                {!isVideoReady && !isCameraLoading && (
                  <p className="text-sm text-muted-foreground text-center">
                    Waiting for camera to be ready...
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Photo Preview */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={previewUrl} alt="Profile preview" />
                    <AvatarFallback className="text-2xl">
                      {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {previewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>

                {/* Photo Options */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={startCamera}
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={triggerFileInput}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>

                  {/* File Input */}
                  <Input
                    ref={fileInputRef}
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="text-sm text-muted-foreground text-center">
                      <p>Selected: {selectedFile.name}</p>
                      <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {!isCameraMode && (
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
                className="bg-glee-spelman hover:bg-glee-spelman/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Save Photo'
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
