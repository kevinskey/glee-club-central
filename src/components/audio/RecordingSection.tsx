import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useRecordingContext } from "@/contexts/RecordingContext";
import { Music2, Mic, Stop, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RecordingSectionProps {
  initialRecordingName?: string;
  initialDescription?: string;
  initialPrivacySetting?: 'public' | 'private';
}

export function RecordingSection({
  initialRecordingName = '',
  initialDescription = '',
  initialPrivacySetting = 'private',
}: RecordingSectionProps) {
  const [recordingName, setRecordingName] = useState(initialRecordingName);
  const [description, setDescription] = useState(initialDescription);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [privacySetting, setPrivacySetting] = useState<"public" | "private">(initialPrivacySetting);
  const [recordingDate, setRecordingDate] = useState<Date>(new Date());
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const { recordings, setRecordings } = useRecordingContext();
  const isMobile = useIsMobile();
  
  // Options for formatting the date
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  
  // Formatted recording date string
  const formattedRecordingDate = format(recordingDate, 'PPPppp');
  
  // Function to update the recording date
  const updateRecordingDate = () => {
    setRecordingDate(new Date());
  };

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new window.AudioContext();
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
    let stream: MediaStream;
    
    const getMicrophone = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };
        
        recorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to record audio.",
          variant: "destructive",
        });
      }
    };
    
    getMicrophone();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    if (!mediaRecorder) {
      toast({
        title: "Media Recorder Not Initialized",
        description: "Please wait for the media recorder to initialize before starting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Initialize audioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }
      
      setAudioChunks([]);
      setIsRecording(true);
      setUploadSuccess(false);
      setUploadError(null);
      setUploadProgress(null);
      updateRecordingDate();
      
      mediaRecorder.start();
      
      toast({
        title: "Recording Started",
        description: "Your recording has started.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your microphone and try again.",
        variant: "destructive",
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Your recording has stopped.",
      });
    }
  };

  // Play the recording
  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  // Pause the recording
  const pauseRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  // Handle audio chunks and create audio URL
  useEffect(() => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }
  }, [audioChunks]);

  // Upload the recording
  const uploadRecording = async () => {
    if (!audioUrl) {
      toast({
        title: "No Recording Available",
        description: "Please make a recording before uploading.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to upload a recording.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const file = new File([blob], `${recordingName || 'recording'}.webm`, { type: 'audio/webm' });
      
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('name', recordingName);
      formData.append('description', description);
      formData.append('privacy', privacySetting);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recordings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload recording');
      }
      
      const newRecording = await uploadResponse.json();
      setRecordings([...recordings, newRecording]);
      
      setUploadProgress(100);
      setUploadSuccess(true);
      toast({
        title: "Upload Successful",
        description: "Your recording has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || 'Failed to upload recording');
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your recording.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Music2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Recording</h2>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="recordingName">Recording Name</Label>
          <Input
            id="recordingName"
            placeholder="My Awesome Recording"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Tell us about your recording"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="privacy">Privacy</Label>
          <select
            id="privacy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={privacySetting}
            onChange={(e) => setPrivacySetting(e.target.value as "public" | "private")}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        <div className="grid gap-2">
          <Label>Recording Date</Label>
          <p className="text-sm text-muted-foreground">{formattedRecordingDate}</p>
        </div>
        
        <div className="grid gap-2">
          <Label>Volume</Label>
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleVolumeChange(value)}
          />
        </div>
        
        {audioUrl && (
          <div className="grid gap-2">
            <Label>Playback</Label>
            <audio ref={audioRef} src={audioUrl} controls volume={volume} />
          </div>
        )}
        
        {uploadError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mr-2 inline-block align-middle" />
            {uploadError}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {!isRecording ? (
            <Button
              variant="outline"
              onClick={startRecording}
              disabled={isUploading}
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isUploading}
                >
                  <Stop className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to stop recording?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={stopRecording}>Stop</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={uploadRecording}
            disabled={isUploading || !audioUrl}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... ({uploadProgress}%)
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
