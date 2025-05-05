
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AudioPageCategory } from '@/types/audio';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useRecordingSave } from '@/hooks/useRecordingSave';
import { RecordingControls } from './RecordingControls';
import { AudioSaveControls } from './AudioSaveControls';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {microphoneActive ? (
            <Mic className="h-5 w-5 text-green-500" />
          ) : (
            <MicOff className="h-5 w-5 text-gray-500" />
          )} 
          Record Audio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                {/* Audio playback and save controls */}
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
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
