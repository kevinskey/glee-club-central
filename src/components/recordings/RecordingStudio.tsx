import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mic, Square, Save, Play, Pause, Download } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { AudioEditor } from "./AudioEditor";
import { AudioCategorySelector } from "../audio/AudioCategorySelector";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export function RecordingStudio() {
  // Recording state
  const [recordingName, setRecordingName] = useState(`Recording ${format(new Date(), "yyyy-MM-dd")}`);
  const [recordingNotes, setRecordingNotes] = useState("");
  const [category, setCategory] = useState("practice");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [edited, setEdited] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Custom hooks
  const { user } = useAuth();
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle audio playback
  const handlePlayPause = () => {
    if (!audioRef.current || !audioURL) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Update playing state when audio ends
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  // Handle recording start
  const handleStartRecording = async () => {
    try {
      // Clear previous recording if any
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
        setEdited(false);
      }
      
      // Set up audio context and analyzer for visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await startRecording();
      
      // Fixed: Check if stream exists before proceeding
      if (stream && canvasRef.current && audioContextRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        
        // Start visualization
        visualize();
      }
      
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
  
  // Handle recording stop
  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Disconnect audio nodes
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
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
  
  // Save recording to Supabase
  const handleSaveRecording = async () => {
    if (!audioURL || !user) {
      toast.error("No recording to save or not logged in");
      return;
    }
    
    try {
      toast.loading("Saving recording...");
      
      // Fetch the audio blob from the URL
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append("file", audioBlob, `${recordingName}.wav`);
      formData.append("title", recordingName);
      formData.append("userId", user.id);
      formData.append("category", category);
      formData.append("notes", recordingNotes);
      
      // Save to Supabase using audio files functionality
      const { data, error } = await fetch('/api/save-recording', {
        method: 'POST',
        body: formData
      }).then(res => res.json());
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("Recording saved successfully");
      
      // Reset form fields but keep the audio
      setRecordingName(`Recording ${format(new Date(), "yyyy-MM-dd-HH-mm")}`);
      setRecordingNotes("");
    } catch (error) {
      toast.dismiss();
      console.error("Error saving recording:", error);
      toast.error("Failed to save recording");
    }
  };
  
  // Export recording as WAV or MP3
  const handleExportRecording = async (format: 'wav' | 'mp3') => {
    if (!audioURL) return;
    
    try {
      // For simplicity, just trigger download with current format
      // In a real implementation, we'd convert to MP3 if requested
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `${recordingName}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  };
  
  // Audio visualization function
  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvasContext.clearRect(0, 0, width, height);
    
    const draw = () => {
      if (!analyserRef.current) return;
      
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);
      
      canvasContext.fillStyle = 'rgb(245, 245, 245)';
      canvasContext.fillRect(0, 0, width, height);
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(234, 88, 12)';
      canvasContext.beginPath();
      
      const sliceWidth = width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      canvasContext.lineTo(width, height / 2);
      canvasContext.stroke();
    };
    
    draw();
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Waveform Visualizer */}
          <div className="bg-muted rounded-md overflow-hidden mb-4">
            <canvas 
              ref={canvasRef} 
              className="w-full h-32" 
              width={800} 
              height={128}
            />
          </div>
          
          {/* Timer Display */}
          <div className="text-center mb-4">
            <div className="text-xl font-mono font-semibold">
              {audioURL && !isRecording ? "Ready to Save" : formatTime(recordingTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {isRecording && (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Recording
                </span>
              )}
            </div>
          </div>
          
          {/* Recording Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isRecording ? (
              <>
                <Button
                  onClick={handleStartRecording}
                  variant="default"
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  disabled={isRecording}
                >
                  <Mic className="h-6 w-6" />
                </Button>
                
                {audioURL && (
                  <Button
                    onClick={handlePlayPause}
                    variant="secondary" 
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                <Square className="h-6 w-6" />
              </Button>
            )}
          </div>
          
          {/* Hidden audio element for playback */}
          {audioURL && (
            <audio 
              ref={audioRef}
              src={audioURL}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          )}
          
          {/* Audio Editor (Only shown when there's a recording) */}
          {audioURL && !isRecording && (
            <AudioEditor 
              audioUrl={audioURL}
              onEdit={(newUrl) => {
                if (audioURL) URL.revokeObjectURL(audioURL);
                setAudioURL(newUrl);
                setEdited(true);
              }}
            />
          )}
          
          {/* Recording Metadata Form */}
          {audioURL && !isRecording && (
            <div className="space-y-4 mt-6 border-t pt-6">
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
                <AudioCategorySelector 
                  value={category} 
                  onChange={setCategory} 
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={recordingNotes}
                  onChange={(e) => setRecordingNotes(e.target.value)}
                  placeholder="Add notes about this recording"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleSaveRecording}
                  className="flex gap-2 items-center flex-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Recording</span>
                </Button>
                
                <div className="flex gap-2 flex-1">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleExportRecording('wav')}
                  >
                    Export WAV
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleExportRecording('mp3')}
                  >
                    Export MP3
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
