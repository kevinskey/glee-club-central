
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Save } from "lucide-react";
import { toast } from "sonner";
import { playClick } from "@/utils/audioUtils";

interface RecordingControlsProps {
  isInitialized: boolean;
  isRecording: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<Blob | null>;
  onSaveRecording?: (audioBlob: Blob, category?: string) => void;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isInitialized,
  isRecording,
  onStartRecording,
  onStopRecording,
  onSaveRecording,
  audioContextRef
}) => {
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleStartRecording = async () => {
    try {
      // Play a click to indicate recording is starting
      if (audioContextRef?.current) {
        playClick(audioContextRef.current);
      }
      
      await onStartRecording();
      toast.info("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Could not start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      const blob = await onStopRecording();
      setRecordedBlob(blob);
      toast.success("Recording stopped");
      
      // Play a click to indicate recording has stopped
      if (audioContextRef?.current) {
        playClick(audioContextRef.current);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Error stopping recording");
    }
  };

  const handleSaveRecording = () => {
    if (!recordedBlob) {
      toast.error("No recording to save");
      return;
    }

    setIsSaving(true);
    try {
      if (onSaveRecording) {
        onSaveRecording(recordedBlob);
      }
    } catch (error) {
      console.error("Failed to save recording:", error);
      toast.error("Error saving recording");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {!isRecording ? (
        <Button
          onClick={handleStartRecording}
          disabled={!isInitialized || isSaving}
          variant="default"
          className="bg-glee-spelman hover:bg-glee-spelman/90"
        >
          <Mic className="mr-2 h-4 w-4" />
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={handleStopRecording}
          variant="destructive"
        >
          <Square className="mr-2 h-4 w-4" />
          Stop Recording
        </Button>
      )}

      {recordedBlob && !isRecording && (
        <Button
          onClick={handleSaveRecording}
          disabled={isSaving}
          variant="outline"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Recording"}
        </Button>
      )}
    </div>
  );
};
