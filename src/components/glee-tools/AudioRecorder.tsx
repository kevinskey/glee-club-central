
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
  Piano 
} from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useRecordingSave } from "@/hooks/useRecordingSave";
import { Label } from "@/components/ui/label";

const PIANO_KEYS = [
  { note: 'C', isSharp: false },
  { note: 'C#', isSharp: true },
  { note: 'D', isSharp: false },
  { note: 'D#', isSharp: true },
  { note: 'E', isSharp: false },
  { note: 'F', isSharp: false },
  { note: 'F#', isSharp: true },
  { note: 'G', isSharp: false },
  { note: 'G#', isSharp: true },
  { note: 'A', isSharp: false },
  { note: 'A#', isSharp: true },
  { note: 'B', isSharp: false }
];

interface AudioRecorderProps {
  onClose?: () => void;
}

export function AudioRecorder({ onClose }: AudioRecorderProps) {
  // Recording and audio state
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [playbackVolume, setPlaybackVolume] = useState(0.7);
  const [octave, setOctave] = useState(4);
  
  // Refs for audio elements and timers
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
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
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error("Failed to create audio context:", error);
        toast.error("Your browser doesn't support Web Audio API");
      }
    }
    return audioContextRef.current;
  };
  
  // Play piano note
  const playNote = (note: string) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }
    
    // Create oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Set note frequency based on note name and octave
    const frequencies: Record<string, number> = {
      'C': 261.63 * Math.pow(2, octave - 4),
      'C#': 277.18 * Math.pow(2, octave - 4),
      'D': 293.66 * Math.pow(2, octave - 4),
      'D#': 311.13 * Math.pow(2, octave - 4),
      'E': 329.63 * Math.pow(2, octave - 4),
      'F': 349.23 * Math.pow(2, octave - 4),
      'F#': 369.99 * Math.pow(2, octave - 4),
      'G': 392.00 * Math.pow(2, octave - 4),
      'G#': 415.30 * Math.pow(2, octave - 4),
      'A': 440.00 * Math.pow(2, octave - 4),
      'A#': 466.16 * Math.pow(2, octave - 4),
      'B': 493.88 * Math.pow(2, octave - 4)
    };
    
    osc.frequency.value = frequencies[note];
    osc.type = 'sine';
    
    // Configure envelope
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    
    // Connect nodes and play
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
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
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioURL]);
  
  // Update audio element volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackVolume;
    }
  }, [playbackVolume]);
  
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Recorder & Piano</h3>
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
      
      {/* Piano Keyboard */}
      <div className="relative h-32 sm:h-40 overflow-hidden flex">
        {PIANO_KEYS.map((key, idx) => {
          if (!key.isSharp) {
            return (
              <button
                key={`${key.note}-${octave}`}
                className="flex-1 bg-white border border-gray-300 rounded-b hover:bg-gray-100 active:bg-gray-200 relative flex flex-col-reverse"
                onClick={() => playNote(key.note)}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {key.note}
                </span>
              </button>
            );
          }
          return null;
        })}
        
        {/* Black keys */}
        <div className="absolute top-0 left-0 w-full h-3/5 flex">
          <div className="w-1/12 flex-shrink-0"></div> {/* C */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('C#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* D */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('D#')}
          />
          <div className="w-1/12 flex-shrink-0"></div>
          <div className="w-1/12 flex-shrink-0"></div> {/* Skip E to F */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('F#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* G */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('G#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* A */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('A#')}
          />
          <div className="w-1/12 flex-shrink-0"></div> {/* B */}
        </div>
      </div>
      
      {/* Octave control */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOctave(Math.max(2, octave - 1))}
          disabled={octave <= 2}
        >
          -
        </Button>
        <span className="min-w-8 text-center">Octave: {octave}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOctave(Math.min(6, octave + 1))}
          disabled={octave >= 6}
        >
          +
        </Button>
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
