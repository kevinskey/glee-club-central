
import React from 'react';
import { Square, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingControlsProps {
  microphoneActive: boolean;
  isRecording: boolean;
  recordingTime: number;
  initializeMicrophone: () => Promise<MediaStream | null>;
  startRecording: () => void;
  stopRecording: () => void;
  formatTime: (seconds: number) => string;
}

export function RecordingControls({
  microphoneActive,
  isRecording,
  recordingTime,
  initializeMicrophone,
  startRecording,
  stopRecording,
  formatTime,
}: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {!microphoneActive && !isRecording && (
        <Button 
          onClick={initializeMicrophone}
          className="gap-2"
        >
          <Mic className="h-4 w-4" /> Activate Microphone
        </Button>
      )}
      
      {microphoneActive && !isRecording && (
        <Button 
          onClick={startRecording}
          variant="default"
          className="gap-2"
        >
          <Mic className="h-4 w-4" /> Start Recording
        </Button>
      )}
      
      {isRecording && (
        <Button 
          variant="destructive" 
          onClick={stopRecording}
          className="gap-2"
        >
          <Square className="h-4 w-4" /> Stop Recording
        </Button>
      )}
      
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Recording: {formatTime(recordingTime)}</span>
        </div>
      )}
      
      {microphoneActive && !isRecording && (
        <div className="flex items-center gap-2 text-green-500">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Microphone active</span>
        </div>
      )}
    </div>
  );
}
