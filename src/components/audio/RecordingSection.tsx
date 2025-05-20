
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Download, Share2, Play, Pause, VolumeX, Volume2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AudioPageCategory } from '@/types/audio';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useRecordingSave } from '@/hooks/useRecordingSave';
import { RecordingControls } from './RecordingControls';
import { AudioSaveControls } from './AudioSaveControls';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { SocialShareButtons } from '../recordings/SocialShareButtons';
import { toast } from 'sonner';
import { audioLogger } from '@/utils/audioUtils';

interface RecordingSectionProps {
  onRecordingSaved: (category?: Exclude<AudioPageCategory, "all">) => void;
}

export function RecordingSection({ onRecordingSaved }: RecordingSectionProps) {
  const [audioSystemReady, setAudioSystemReady] = useState(false);
  const [showTestControls, setShowTestControls] = useState(false);
  
  const {
    isRecording,
    microphoneActive,
    recordingTime,
    audioURL,
    isPlaying,
    permissionState,
    isInitialized,
    setIsPlaying,
    audioRef,
    initializeMicrophone,
    startRecording,
    stopRecording,
    releaseMicrophone,
    togglePlayback,
    formatTime,
    testAudioOutput
  } = useAudioRecorder();

  const {
    recordingName,
    setRecordingName,
    recordingCategory,
    setRecordingCategory,
    isSaving,
    saveRecording
  } = useRecordingSave({
    onSaveComplete: () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      const savedCategory = recordingCategory;
      onRecordingSaved(savedCategory);
    }
  });

  // Check audio system status on load
  useEffect(() => {
    setAudioSystemReady(isInitialized);
    audioLogger.log('Recording section - Audio system initialized:', isInitialized);
    audioLogger.log('Recording section - Permission state:', permissionState);
  }, [isInitialized, permissionState]);

  // Download recording
  const handleDownloadRecording = () => {
    if (audioURL) {
      const downloadLink = document.createElement('a');
      downloadLink.href = audioURL;
      downloadLink.download = `${recordingName || 'recording'}.wav`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success("Recording downloaded");
    }
  };

  // Handle save recording
  const handleSaveRecording = async () => {
    if (!audioURL) return;
    const savedCategory = await saveRecording(audioURL);
    if (savedCategory) {
      onRecordingSaved(savedCategory);
    }
  };

  // Discard recording
  const discardRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      toast.success("Recording discarded");
      // Pass undefined to reset the view
      onRecordingSaved(undefined);
    }
    
    // Release microphone if needed
    if (microphoneActive) {
      releaseMicrophone();
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {microphoneActive ? (
              <Mic className="h-5 w-5 text-green-500" />
            ) : (
              <MicOff className="h-5 w-5 text-gray-500" />
            )} 
            Record New Audio
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowTestControls(!showTestControls)}
          >
            {showTestControls ? "Hide Test Controls" : "Show Test Controls"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* System status indicator */}
          {showTestControls && (
            <div className="bg-secondary/20 p-3 rounded-md mb-4 space-y-2">
              <h4 className="text-sm font-medium">Audio System Status</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">System Initialized:</span>{" "}
                  <span className={isInitialized ? "text-green-500" : "text-red-500"}>
                    {isInitialized ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Mic Permission:</span>{" "}
                  <span className={permissionState === "granted" ? "text-green-500" : 
                                  permissionState === "denied" ? "text-red-500" : "text-yellow-500"}>
                    {permissionState}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={testAudioOutput}
                >
                  <Volume2 className="h-3 w-3 mr-1" /> Test Audio Output
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (microphoneActive) {
                      releaseMicrophone();
                      toast.success("Microphone released");
                    } else {
                      initializeMicrophone();
                    }
                  }}
                >
                  {microphoneActive ? (
                    <>
                      <VolumeX className="h-3 w-3 mr-1" /> Release Microphone
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 mr-1" /> Initialize Microphone
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Recording controls */}
          <RecordingControls 
            microphoneActive={microphoneActive}
            isRecording={isRecording}
            recordingTime={recordingTime}
            initializeMicrophone={initializeMicrophone}
            startRecording={startRecording}
            stopRecording={stopRecording}
            formatTime={formatTime}
          />
          
          {audioURL && (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col space-y-4">
                {/* Audio player */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={togglePlayback}
                        className="h-8 w-8"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm font-medium">
                        {recordingName || "New Recording"}
                      </span>
                    </div>
                    <audio 
                      ref={audioRef} 
                      className="hidden" 
                      onEnded={() => setIsPlaying(false)}
                      onError={(e) => {
                        audioLogger.error('Audio player error:', e);
                        toast.error("Error playing the audio");
                      }}
                    />
                  </div>
                </div>

                {/* Audio save controls */}
                <AudioSaveControls 
                  audioRef={audioRef}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  togglePlayback={togglePlayback}
                  recordingName={recordingName}
                  setRecordingName={setRecordingName}
                  recordingCategory={recordingCategory}
                  setRecordingCategory={setRecordingCategory}
                  isSaving={isSaving}
                  handleSaveRecording={handleSaveRecording}
                  discardRecording={discardRecording}
                />
                
                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  {/* Download button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Download Recording</h4>
                        <p className="text-sm text-muted-foreground">
                          This will download the recording to your device as a WAV file.
                        </p>
                        <Button 
                          onClick={handleDownloadRecording}
                          className="w-full gap-2 mt-2"
                        >
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Share button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Share Recording</h4>
                        <p className="text-sm text-muted-foreground">
                          Share this recording with others or on social media.
                        </p>
                        {audioURL && (
                          <SocialShareButtons 
                            url={audioURL} 
                            title={recordingName || "My Recording"}
                          />
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
