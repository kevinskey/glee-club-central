
import React, { useState } from 'react';
import { Mic, MicOff, Download, Share2, Play, Pause } from 'lucide-react';
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

interface RecordingSectionProps {
  onRecordingSaved: (category?: Exclude<AudioPageCategory, "all">) => void;
}

export function RecordingSection({ onRecordingSaved }: RecordingSectionProps) {
  const {
    isRecording,
    microphoneActive,
    recordingTime,
    audioURL,
    isPlaying,
    setIsPlaying,
    audioRef,
    initializeMicrophone,
    startRecording,
    stopRecording,
    releaseMicrophone,
    togglePlayback,
    formatTime
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

  // Download recording
  const handleDownloadRecording = () => {
    if (audioURL) {
      const downloadLink = document.createElement('a');
      downloadLink.href = audioURL;
      downloadLink.download = `${recordingName || 'recording'}.wav`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Handle save recording
  const handleSaveRecording = async () => {
    const savedCategory = await saveRecording(audioURL);
    if (savedCategory) {
      onRecordingSaved(savedCategory);
    }
  };

  // Discard recording
  const discardRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      onRecordingSaved();
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          {microphoneActive ? (
            <Mic className="h-5 w-5 text-green-500" />
          ) : (
            <MicOff className="h-5 w-5 text-gray-500" />
          )} 
          Record New Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
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
                        {recordingName}
                      </span>
                    </div>
                    <audio ref={audioRef} className="hidden" />
                  </div>

                  {/* Audio waveform visualization could be added here in the future */}
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
