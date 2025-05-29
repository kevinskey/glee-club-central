
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Camera, X, RefreshCw, Loader2, Wand2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PhotoEnhancementModal } from './PhotoEnhancementModal';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [capturedPhotoForEnhancement, setCapturedPhotoForEnhancement] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkCameraPermissions = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔐 Checking camera permissions...');
      
      // Check if navigator.permissions is supported
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('📋 Camera permission status:', permission.state);
        
        if (permission.state === 'denied') {
          toast.error('Camera access denied. Please enable camera permissions in your browser settings.');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.log('⚠️ Permission check not supported or failed:', error);
      // Continue anyway, will handle in getUserMedia
      return true;
    }
  }, []);

  const startCamera = useCallback(async () => {
    console.log('🎥 Starting camera...');
    setIsCameraLoading(true);
    setIsVideoReady(false);
    setCameraError('');
    
    try {
      // Check permissions first
      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        setIsCameraLoading(false);
        return;
      }

      // Enhanced constraints for better Mac compatibility
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      };

      console.log('📱 Requesting media with constraints:', constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Camera stream obtained successfully');
      console.log('🎬 Stream tracks:', mediaStream.getTracks().map(track => ({
        kind: track.kind,
        label: track.label,
        enabled: track.enabled,
        readyState: track.readyState
      })));
      
      setStream(mediaStream);
      setIsCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('📹 Video source set to element');
        
        // Force video to load
        videoRef.current.load();
        
        // Multiple event listeners for better compatibility
        const video = videoRef.current;
        
        const handleCanPlay = () => {
          console.log('🎬 Video can play event fired');
          setIsVideoReady(true);
          setIsCameraLoading(false);
        };

        const handleLoadedData = () => {
          console.log('📊 Video loaded data event fired');
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setIsVideoReady(true);
            setIsCameraLoading(false);
          }
        };

        const handleLoadedMetadata = () => {
          console.log('📐 Video metadata loaded');
          console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        // Cleanup function
        const cleanup = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };

        // Set a timeout to check if video is ready after some time
        setTimeout(() => {
          if (video.readyState >= 2 && video.videoWidth > 0) {
            console.log('✅ Video ready after timeout check');
            setIsVideoReady(true);
            setIsCameraLoading(false);
          }
          cleanup();
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      setIsCameraLoading(false);
      setIsCameraMode(false);
      
      let errorMessage = 'Unable to access camera.';
      
      if (error instanceof Error) {
        console.log('📋 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera constraints could not be satisfied. Trying with basic settings...';
            // Try again with minimal constraints
            setTimeout(() => startCameraWithMinimalConstraints(), 1000);
            return;
          case 'SecurityError':
            errorMessage = 'Camera access blocked due to security restrictions. Please ensure you\'re using HTTPS.';
            break;
          case 'AbortError':
            errorMessage = 'Camera access was interrupted.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  }, [checkCameraPermissions]);

  const startCameraWithMinimalConstraints = useCallback(async () => {
    console.log('🔄 Trying camera with minimal constraints...');
    try {
      const minimalConstraints: MediaStreamConstraints = {
        video: true,
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(minimalConstraints);
      console.log('✅ Camera working with minimal constraints');
      
      setStream(mediaStream);
      setIsCameraMode(true);
      setCameraError('');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setTimeout(() => {
          setIsVideoReady(true);
          setIsCameraLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Minimal constraints also failed:', error);
      setCameraError('Camera initialization failed completely. Please try using file upload instead.');
    }
  }, []);

  const handleVideoReady = useCallback(() => {
    console.log('🎯 Video ready handler called');
    
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('📐 Video ready state:', {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        currentTime: video.currentTime,
        duration: video.duration
      });
      
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        console.log('✅ Video is fully ready for capture');
        setIsVideoReady(true);
        setIsCameraLoading(false);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Track stopped:', track.kind, track.label);
      });
      setStream(null);
    }
    setIsCameraMode(false);
    setIsVideoReady(false);
    setIsCameraLoading(false);
    setCameraError('');
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    console.log('📸 Capture photo button clicked');

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

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video dimensions are invalid');
      }

      console.log('🎨 Drawing to canvas with dimensions:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      });
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      console.log('🖼️ Converting canvas to base64...');
      const base64String = canvas.toDataURL('image/jpeg', 0.8);

      console.log('✅ Photo captured successfully');
      setCapturedPhotoForEnhancement(base64String);
      setPreviewUrl(base64String);
      
      stopCamera();
      setShowEnhancement(true);
      toast.success('Photo captured! Choose an enhancement option.');
      
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
    setCameraError('');
    setTimeout(() => {
      startCamera();
    }, 500);
  }, [stopCamera, startCamera]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setCapturedPhotoForEnhancement(result);
        setShowEnhancement(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      toast.error('Please select or capture a photo first');
      return;
    }

    setIsUploading(true);
    try {
      onPhotoSelect(previewUrl);
      toast.success('Photo uploaded successfully');
      onClose();
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
    setCapturedPhotoForEnhancement('');
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
    setShowEnhancement(false);
    setCapturedPhotoForEnhancement('');
    setCameraError('');
    onClose();
  };

  const handleEnhancementComplete = (enhancedPhotoUrl: string) => {
    setPreviewUrl(enhancedPhotoUrl);
    setShowEnhancement(false);
  };

  return (
    <>
      <Dialog open={isOpen && !showEnhancement} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {isCameraMode ? 'Take Photo' : 'Upload Profile Photo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Camera Error Alert */}
            {cameraError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {cameraError}
                </AlertDescription>
              </Alert>
            )}

            {/* Camera View */}
            {isCameraMode ? (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      onLoadedData={handleVideoReady}
                      onCanPlay={handleVideoReady}
                      onLoadedMetadata={handleVideoReady}
                      className="w-full max-w-sm rounded-lg"
                      style={{ display: isCameraLoading ? 'none' : 'block' }}
                    />
                    {isCameraLoading && (
                      <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-glee-spelman" />
                        <p className="text-sm text-muted-foreground">Initializing camera...</p>
                        <p className="text-xs text-muted-foreground">This may take a few seconds on Mac</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {isVideoReady && (
                  <div className="text-xs text-center text-green-600">
                    ✅ Camera ready for capture
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={capturePhoto}
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
                
                {!isVideoReady && !isCameraLoading && !cameraError && (
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEnhancement(true)}
                        className="text-glee-spelman hover:text-glee-spelman"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Enhance Photo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Photo
                      </Button>
                    </div>
                  )}
                </div>

                {/* Photo Options */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={startCamera}
                      className="w-full"
                      disabled={isCameraLoading}
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
                disabled={!previewUrl || isUploading}
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

      {/* Photo Enhancement Modal */}
      <PhotoEnhancementModal
        isOpen={showEnhancement}
        onClose={() => setShowEnhancement(false)}
        onPhotoSelect={handleEnhancementComplete}
        originalPhoto={capturedPhotoForEnhancement}
        userName={userName}
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}
