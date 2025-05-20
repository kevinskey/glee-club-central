
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Mic, Square, Music } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { audioCategoryLabels } from "./audioCategoryUtils";

// Recording section props
export interface RecordingSectionProps {
  onRecordingSaved?: (category?: string) => void;
}

export function RecordingSection({ onRecordingSaved }: RecordingSectionProps) {
  // State for recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [recordingName, setRecordingName] = useState("");
  const [playbackVolume, setPlaybackVolume] = useState(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string>("my_tracks");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);
  
  // Hooks
  const { startRecording, stopRecording } = useAudioRecorder();
  const { user } = useAuth();
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle recording state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop the recording
      try {
        const audioBlob = await stopRecording();
        if (audioBlob) {
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          
          // Set a default name based on date/time
          const now = new Date();
          const defaultName = `Recording ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
          setRecordingName(defaultName);
          
          // Stop the timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          setRecordingDuration(elapsedTime);
          toast.success("Recording stopped");
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast.error("Failed to stop recording");
      }
    } else {
      // Start a new recording
      try {
        // Reset previous recording if any
        setAudioURL("");
        setElapsedTime(0);
        
        await startRecording();
        
        // Start the timer to track recording duration
        timerRef.current = window.setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
        
        toast.success("Recording started");
      } catch (error) {
        console.error("Error starting recording:", error);
        toast.error("Failed to start recording. Please check microphone permissions.");
        return;
      }
    }
    
    setIsRecording(!isRecording);
  };
  
  // Save the recording
  const saveRecording = async () => {
    if (!audioURL) {
      toast.error("No recording to save");
      return;
    }
    
    if (!recordingName.trim()) {
      toast.error("Please enter a name for your recording");
      return;
    }
    
    try {
      // Fetch the audio file from the URL
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      
      // Create a File object from the Blob
      const audioFile = new File([audioBlob], `${recordingName.trim()}.webm`, {
        type: "audio/webm",
      });
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("name", recordingName.trim());
      formData.append("category", selectedCategory);
      
      if (user) {
        formData.append("user_id", user.id);
      }
      
      // Here you would typically send this to your backend
      console.log("Saving recording:", {
        name: recordingName,
        category: selectedCategory,
        duration: recordingDuration,
        user: user?.id
      });
      
      // For now, just show a success message
      toast.success("Recording saved successfully");
      
      // Clear the current recording
      setAudioURL("");
      setRecordingName("");
      
      // Call the callback if provided
      if (onRecordingSaved) {
        onRecordingSaved(selectedCategory);
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      toast.error("Failed to save recording");
    }
  };
  
  // Update audio element volume when playback volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackVolume;
    }
  }, [playbackVolume, audioURL]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Stop any ongoing recording
      if (isRecording) {
        stopRecording().catch(console.error);
      }
      
      // Clear any timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Revoke object URL if any
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [isRecording, audioURL, stopRecording]);
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Recorder</h3>
        <div className="text-sm font-mono">
          {isRecording ? (
            <span className="text-red-500 animate-pulse flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              {formatTime(elapsedTime)}
            </span>
          ) : (
            audioURL ? formatTime(recordingDuration) : "00:00"
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="w-16 h-16 rounded-full"
        >
          {isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {audioURL && (
        <div className="space-y-4">
          <audio
            ref={audioRef}
            src={audioURL}
            controls
          />
          
          <div className="space-y-2">
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
          
          <div className="space-y-2">
            <Label htmlFor="recording-name">Recording Name</Label>
            <Input
              id="recording-name"
              value={recordingName}
              onChange={(e) => setRecordingName(e.target.value)}
              placeholder="Enter recording name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(audioCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={saveRecording} className="w-full flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Save Recording</span>
          </Button>
        </div>
      )}
    </div>
  );
}
