
import React from 'react';
import { Square, Mic, MicOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { resetAudioSystem } from '@/utils/audioUtils';

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
    <div className="flex flex-col gap-4">
      {/* Status bar */}
      <div className="flex items-center justify-between bg-muted/30 rounded-md p-2 px-3">
        <div className="flex items-center gap-2">
          {!microphoneActive && !isRecording && (
            <span className="text-yellow-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Microphone inactive
            </span>
          )}
          
          {microphoneActive && !isRecording && (
            <span className="text-green-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Microphone active
            </span>
          )}
          
          {isRecording && (
            <span className="text-red-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Recording: {formatTime(recordingTime)}
            </span>
          )}
        </div>
        
        {/* Reset button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={async () => {
                  await resetAudioSystem();
                  toast.success("Audio system reset complete");
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset audio system</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Main controls */}
      <div className="flex flex-wrap gap-4 items-center">
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
      </div>
    </div>
  );
}
