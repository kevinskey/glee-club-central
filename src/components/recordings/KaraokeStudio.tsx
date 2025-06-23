
import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Music2, Save, Play, Pause, Rewind, Volume2, Volume1, VolumeX, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackingTrackSelector } from "./BackingTrackSelector";
import { AudioFile } from "@/types/audio";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useMixedRecordings } from "@/hooks/useMixedRecordings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function KaraokeStudio() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const backingTrackRef = useRef<HTMLAudioElement | null>(null);
  const recordingPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // State
  const [selectedTrack, setSelectedTrack] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerRef, setTimerRef] = useState<number | null>(null);
  const [recordingName, setRecordingName] = useState("My Karaoke Recording");
  const [recordingNotes, setRecordingNotes] = useState("");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [vocalVolume, setVocalVolume] = useState(1.0);
  const [backingVolume, setBackingVolume] = useState(0.7);
  const [countdownValue, setCountdownValue] = useState(0);
  const [isShowingSaveForm, setIsShowingSaveForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [audioDelay, setAudioDelay] = useState(0); // Audio delay in milliseconds for Bluetooth compensation
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Custom hooks
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const { saveMixedRecording } = useMixedRecordings();
  
  // Create audio context only once on mount
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      canvasContext.strokeStyle = isRecording ? 'rgb(234, 88, 12)' : 'rgb(99, 102, 241)';
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
  
  // Start countdown and then recording
  const handleStartRecording = () => {
    // Reset recording URL if exists
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
      setRecordingUrl(null);
    }
    
    // Start countdown
    setCountdownValue(3);
    let count = 3;
    
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdownValue(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        startActualRecording();
      }
    }, 1000);
  };
  
  // Actually start recording after countdown with delay compensation
  const startActualRecording = async () => {
    try {
      // Start recording first to capture the delay
      const stream = await startRecording();
      
      // Apply audio delay compensation for backing track
      const delayMs = audioDelay;
      
      const startBackingTrack = () => {
        if (selectedTrack && backingTrackRef.current) {
          backingTrackRef.current.currentTime = 0;
          backingTrackRef.current.volume = backingVolume;
          backingTrackRef.current.play()
            .catch(err => {
              console.error("Error playing backing track:", err);
              toast.error("Could not play backing track. Please try again.");
            });
        }
      };
      
      // Start backing track with delay compensation
      if (delayMs > 0) {
        setTimeout(startBackingTrack, delayMs);
        toast.info(`Backing track will start in ${delayMs}ms to compensate for audio delay`);
      } else {
        startBackingTrack();
      }
      
      // Only proceed if we have a valid stream
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
      const timer = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setTimerRef(timer);
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Could not start recording. Please check microphone permissions.");
    }
  };
  
  // Stop recording
  const handleStopRecording = async () => {
    try {
      // Stop backing track if playing
      if (backingTrackRef.current) {
        backingTrackRef.current.pause();
      }
      
      // Stop recording
      const audioBlob = await stopRecording();
      
      // Clear timer
      if (timerRef !== null) {
        clearInterval(timerRef);
        setTimerRef(null);
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
        setRecordingUrl(url);
        setIsShowingSaveForm(true);
        toast.success("Recording stopped");
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Error stopping recording");
    }
  };
  
  // Save mixed recording to Supabase
  const handleSaveMixedRecording = async () => {
    if (!recordingUrl) {
      toast.error("No recording to save");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Fetch the audio blob from the URL
      const response = await fetch(recordingUrl);
      const audioBlob = await response.blob();
      
      // Save to Supabase with delay compensation info
      const notes = recordingNotes + (audioDelay > 0 ? `\n\nAudio delay compensation: ${audioDelay}ms` : '');
      
      const result = await saveMixedRecording(
        audioBlob,
        recordingName,
        selectedTrack?.id,
        notes,
        vocalVolume,
        backingVolume
      );
      
      if (result) {
        // Reset form fields after successful save
        setRecordingName("My Karaoke Recording");
        setRecordingNotes("");
        setIsShowingSaveForm(false);
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      toast.error("Failed to save recording");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle audio playback for preview
  const togglePlayback = () => {
    if (!recordingPlayerRef.current || !recordingUrl) return;
    
    if (isPlaying) {
      recordingPlayerRef.current.pause();
    } else {
      recordingPlayerRef.current.play().catch(console.error);
      
      // If backing track exists, play it in sync with delay compensation
      if (selectedTrack && backingTrackRef.current && !isRecording) {
        const startBackingTrack = () => {
          backingTrackRef.current!.currentTime = 0;
          backingTrackRef.current!.volume = backingVolume;
          backingTrackRef.current!.play().catch(console.error);
        };
        
        if (audioDelay > 0) {
          setTimeout(startBackingTrack, audioDelay);
        } else {
          startBackingTrack();
        }
      }
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Reset playback to beginning
  const handleRewind = () => {
    if (recordingPlayerRef.current) {
      recordingPlayerRef.current.currentTime = 0;
      
      if (backingTrackRef.current) {
        backingTrackRef.current.currentTime = 0;
      }
    }
  };
  
  // Handle audio ending
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  // Update backing track volume
  useEffect(() => {
    if (backingTrackRef.current) {
      backingTrackRef.current.volume = backingVolume;
    }
  }, [backingVolume]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef !== null) {
        clearInterval(timerRef);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl, timerRef]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Backing Track Selector */}
          <div className="mb-6">
            <BackingTrackSelector 
              onTrackSelected={setSelectedTrack}
              selectedTrackId={selectedTrack?.id}
            />
          </div>
          
          {/* Advanced Settings Toggle */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center gap-2"
            >
              <Headphones className="h-4 w-4" />
              {showAdvancedSettings ? 'Hide' : 'Show'} Bluetooth Settings
            </Button>
          </div>
          
          {/* Advanced Audio Settings */}
          {showAdvancedSettings && (
            <div className="mb-6 p-4 bg-muted rounded-lg space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    Bluetooth Audio Delay Compensation
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {audioDelay}ms
                  </span>
                </div>
                <Slider 
                  value={[audioDelay]} 
                  onValueChange={(values) => setAudioDelay(values[0])}
                  min={0}
                  max={500}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Compensates for Bluetooth headphone delay. Start with 150-250ms for most Bluetooth devices.
                  This delays the backing track to sync with your vocal recording.
                </p>
              </div>
            </div>
          )}
          
          {/* Hidden backing track audio element */}
          {selectedTrack && (
            <audio 
              ref={backingTrackRef}
              src={selectedTrack.file_url}
              preload="auto"
              onEnded={handleAudioEnded}
              className="hidden"
              crossOrigin="anonymous"
            />
          )}
          
          {/* Waveform Visualizer */}
          <div className="bg-muted rounded-md overflow-hidden mb-4">
            <canvas 
              ref={canvasRef} 
              className="w-full h-32" 
              width={800} 
              height={128}
            />
          </div>
          
          {/* Timer and Status Display */}
          <div className="text-center mb-4">
            <div className="text-xl font-mono font-semibold">
              {countdownValue > 0 ? (
                <div className="text-2xl text-primary animate-pulse">{countdownValue}</div>
              ) : (
                <div>{formatTime(recordingTime)}</div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {isRecording ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Recording {audioDelay > 0 && `(${audioDelay}ms delay compensation)`}
                </span>
              ) : selectedTrack ? (
                <span className="flex items-center justify-center gap-1">
                  <Music2 className="h-3 w-3" />
                  {selectedTrack.title}
                </span>
              ) : (
                "Ready to record"
              )}
            </div>
          </div>
          
          {/* Volume Controls */}
          {(isRecording || recordingUrl) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">
                    <Mic className="h-3 w-3" /> Vocal Volume
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(vocalVolume * 100)}%
                  </span>
                </div>
                <Slider 
                  value={[vocalVolume * 100]} 
                  onValueChange={(values) => setVocalVolume(values[0] / 100)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">
                    <Music2 className="h-3 w-3" /> Backing Volume
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(backingVolume * 100)}%
                  </span>
                </div>
                <Slider 
                  value={[backingVolume * 100]} 
                  onValueChange={(values) => setBackingVolume(values[0] / 100)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}
          
          {/* Recording Controls */}
          <div className="flex justify-center space-x-4 mb-4">
            {!isRecording && !recordingUrl && (
              <Button
                onClick={handleStartRecording}
                variant="default"
                size="lg"
                className="w-16 h-16 rounded-full"
                disabled={isRecording || countdownValue > 0}
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}
            
            {isRecording && (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                <Square className="h-6 w-6" />
              </Button>
            )}
            
            {recordingUrl && !isShowingSaveForm && (
              <>
                <Button
                  onClick={togglePlayback}
                  variant="secondary" 
                  size="lg"
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  onClick={handleRewind}
                  variant="outline" 
                  size="lg"
                  className="w-12 h-12 rounded-full"
                >
                  <Rewind className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={() => setIsShowingSaveForm(true)}
                  variant="default"
                  size="lg"
                  className="w-12 h-12 rounded-full"
                >
                  <Save className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          
          {/* Audio Preview Element */}
          {recordingUrl && (
            <audio
              ref={recordingPlayerRef}
              src={recordingUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          )}
          
          {/* Save Form */}
          {isShowingSaveForm && recordingUrl && (
            <div className="space-y-4 mt-4 border-t pt-4">
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={recordingNotes}
                  onChange={(e) => setRecordingNotes(e.target.value)}
                  placeholder="Add notes about this recording"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsShowingSaveForm(false)}
                  disabled={isSaving}
                >
                  Back to Preview
                </Button>
                
                <Button 
                  onClick={handleSaveMixedRecording}
                  disabled={isSaving}
                  className="flex gap-2 items-center"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Recording'}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
