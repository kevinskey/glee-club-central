import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Mic, 
  Square, 
  Save, 
} from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useRecordingSave } from "@/hooks/useRecordingSave";
import { Label } from "@/components/ui/label";

interface AudioRecorderProps {
  onClose?: () => void;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function AudioRecorder({ onClose, audioContextRef }: AudioRecorderProps) {
  // Recording and audio state
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [playbackVolume, setPlaybackVolume] = useState(0.7);
  
  // Refs for audio elements and timers
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  
  // Custom hooks
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const { 
    recordingName, 
    setRecordingName, 
    recordingCategory, 
    setRecordingCategory,
    isSaving, 
    saveRecording 
  } = useRecordingSave({
    onSaveComplete: () => {
      setAudioURL(null);
      toast.success("Recording saved successfully");
    }
  });
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Initialize audio context
  const getAudioContext = () => {
    // Use the provided audio context if available
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    // Otherwise create or use our local audio context
    if (!localAudioContextRef.current) {
      try {
        localAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error("Failed to create audio context:", error);
        toast.error("Your browser doesn't support Web Audio API");
      }
    }
    return localAudioContextRef.current;
  };
  
  // Handle recording
  const handleStartRecording = async () => {
    try {
      await startRecording();
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Could not start recording. Please check microphone permissions.");
    }
  };
  
  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (audioBlob) {
        // Create URL for audio playback
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        toast.success("Recording stopped");
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Error stopping recording");
    }
  };
  
  // Handle save
  const handleSaveRecording = async () => {
    if (!audioURL) {
      toast.error("No recording to save");
      return;
    }
    
    try {
      await saveRecording(audioURL);
    } catch (error) {
      console.error("Failed to save recording:", error);
      toast.error("Error saving recording");
    }
  };
  
  // Clean up resources
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      
      // Only close the local audio context if we created it
      if (!audioContextRef && localAudioContextRef.current && localAudioContextRef.current.state !== 'closed') {
        localAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioURL, audioContextRef]);
  
  // Update audio element volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackVolume;
    }
  }, [playbackVolume]);
  
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recording Studio</h3>
        <div className="text-sm font-mono">
          {isRecording ? (
            <span className="text-red-500 animate-pulse flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              {formatTime(recordingTime)}
            </span>
          ) : (
            audioURL ? "Ready to save" : "Ready to record"
          )}
        </div>
      </div>
      
      {/* Recording controls */}
      <div className="flex justify-center my-4">
        {isRecording ? (
          <Button
            onClick={handleStopRecording}
            variant="destructive"
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            <Square className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={handleStartRecording}
            variant="default"
            size="lg"
            className="w-16 h-16 rounded-full"
            disabled={!!audioURL}
          >
            <Mic className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      {/* Audio playback and save controls */}
      {audioURL && (
        <div className="space-y-3">
          <audio
            ref={audioRef}
            src={audioURL}
            controls
            className="w-full"
          />
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label>Playback Volume</Label>
              <span className="text-xs">{Math.round(playbackVolume * 100)}%</span>
            </div>
            <Slider 
              value={[playbackVolume]} 
              min={0} 
              max={1} 
              step={0.01}
              onValueChange={(values) => setPlaybackVolume(values[0])}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="recording-name">Recording Name</Label>
            <Input
              id="recording-name"
              value={recordingName}
              onChange={(e) => setRecordingName(e.target.value)}
              placeholder="Enter recording name"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Select value={recordingCategory} onValueChange={setRecordingCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="my_tracks">My Tracks</SelectItem>
                <SelectItem value="recordings">Recordings</SelectItem>
                <SelectItem value="part_tracks">Part Tracks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSaveRecording}
            className="w-full flex gap-2 items-center"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Recording"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
