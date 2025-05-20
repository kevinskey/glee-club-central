
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Play, Square, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NOTE_FREQUENCIES, resumeAudioContext } from "@/utils/audioUtils";
import { supabase } from "@/integrations/supabase/client";

// Piano key type
type PianoKey = {
  note: string;
  frequency: number;
  isSharp: boolean;
  label: string;
};

// Type for the waveform options
type WaveformType = "sine" | "triangle" | "square" | "sawtooth";

// Type for recorded note
type RecordedNote = {
  note: string;
  frequency: number;
  timestamp: number;
  duration: number;
};

interface PitchPipeProps {
  audioContextRef: MutableRefObject<AudioContext | null>;
}

export function PitchPipe({ audioContextRef }: PitchPipeProps) {
  // State
  const [octaveOffset, setOctaveOffset] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  
  // References
  const activeOscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const recordingStartTime = useRef<number>(0);
  const playbackTimer = useRef<number | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Generate piano keys based on octave offset
  const getPianoKeys = (): PianoKey[] => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = 4 + octaveOffset;
    
    return noteNames.map(noteName => {
      const note = `${noteName}${octave}`;
      const isSharp = noteName.includes("#");
      return {
        note,
        frequency: NOTE_FREQUENCIES[note] || 0,
        isSharp,
        label: noteName
      };
    });
  };
  
  // Safe initialization of audio nodes
  const initAudioNodes = () => {
    if (!audioContextRef.current) return false;
    
    try {
      // Resume audio context if needed
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(console.error);
      }
      
      // Create gain node if it doesn't exist
      if (!gainNode.current) {
        gainNode.current = audioContextRef.current.createGain();
        gainNode.current.connect(audioContextRef.current.destination);
      }
      
      // Set volume
      gainNode.current.gain.value = volume;
      return true;
    } catch (error) {
      console.error("Failed to initialize audio nodes:", error);
      return false;
    }
  };
  
  // Play a note with optional duration
  const playNote = (frequency: number, duration?: number) => {
    if (!initAudioNodes() || !audioContextRef.current || !gainNode.current) {
      toast({ title: "Audio Error", description: "Could not initialize audio system" });
      return;
    }
    
    try {
      // Stop any currently playing note
      if (activeOscillator.current) {
        activeOscillator.current.stop();
        activeOscillator.current.disconnect();
        activeOscillator.current = null;
      }
      
      // Create and configure oscillator
      const osc = audioContextRef.current.createOscillator();
      osc.type = waveform;
      osc.frequency.value = frequency;
      osc.connect(gainNode.current);
      
      // Start the oscillator
      osc.start();
      activeOscillator.current = osc;
      setIsPlaying(true);
      
      // If duration is specified, stop after that duration
      if (duration) {
        setTimeout(() => {
          if (osc === activeOscillator.current) {
            osc.stop();
            osc.disconnect();
            activeOscillator.current = null;
            setIsPlaying(false);
          }
        }, duration * 1000);
      }
    } catch (error) {
      console.error("Error playing note:", error);
      toast({ title: "Audio Error", description: "Failed to play note" });
    }
  };
  
  // Stop the currently playing note
  const stopNote = () => {
    if (activeOscillator.current) {
      activeOscillator.current.stop();
      activeOscillator.current.disconnect();
      activeOscillator.current = null;
    }
    setIsPlaying(false);
    setCurrentNote(null);
  };
  
  // Handle clicking a piano key
  const handlePianoKeyClick = (key: PianoKey) => {
    // Start recording if in recording mode
    if (isRecording) {
      const now = Date.now();
      const timestamp = now - recordingStartTime.current;
      
      setRecordedNotes(prev => [
        ...prev,
        {
          note: key.note,
          frequency: key.frequency,
          timestamp,
          duration: 1.0 // Default 1 second duration
        }
      ]);
    }
    
    // Play the note for 1 second
    playNote(key.frequency, 1.0);
    setCurrentNote(key.note);
  };
  
  // Start recording notes
  const handleStartRecording = () => {
    setRecordedNotes([]);
    recordingStartTime.current = Date.now();
    setIsRecording(true);
    toast({ title: "Recording started", description: "Play notes to record them" });
  };
  
  // Stop recording notes
  const handleStopRecording = () => {
    setIsRecording(false);
    toast({ title: "Recording stopped", description: `${recordedNotes.length} notes recorded` });
  };
  
  // Play back the recorded notes
  const playRecording = () => {
    if (recordedNotes.length === 0) {
      toast({ title: "No Notes", description: "There are no recorded notes to play" });
      return;
    }
    
    setIsPlayingRecording(true);
    
    // Sort notes by timestamp
    const sortedNotes = [...recordedNotes].sort((a, b) => a.timestamp - b.timestamp);
    let lastTimerID: number | null = null;
    
    // Play each note at the appropriate time
    sortedNotes.forEach(note => {
      const timerId = window.setTimeout(() => {
        playNote(note.frequency, note.duration);
      }, note.timestamp);
      
      lastTimerID = timerId;
    });
    
    // Set a timer to mark recording as done playing
    const finalTimerId = window.setTimeout(() => {
      setIsPlayingRecording(false);
    }, sortedNotes[sortedNotes.length - 1].timestamp + 1000);
    
    // Store the ID of the last timer for cleanup
    playbackTimer.current = finalTimerId;
  };
  
  // Stop the recording playback
  const stopPlayback = () => {
    if (playbackTimer.current) {
      clearTimeout(playbackTimer.current);
      playbackTimer.current = null;
    }
    
    stopNote();
    setIsPlayingRecording(false);
  };
  
  // Save the recording to Supabase
  const saveRecording = async () => {
    if (!user || !recordedNotes.length) {
      toast({
        title: "Cannot Save",
        description: !user ? "You must be logged in to save recordings" : "No notes to save",
        variant: "destructive"
      });
      return;
    }
    
    if (!recordingName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your recording",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.from("pitch_recordings").insert({
        user_id: user.id,
        name: recordingName,
        data: {
          notes: recordedNotes,
          waveform,
          created_at: new Date().toISOString()
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Recording Saved",
        description: "Your recording has been saved successfully"
      });
      
      setRecordingName("");
    } catch (error) {
      console.error("Error saving recording:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your recording",
        variant: "destructive"
      });
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopNote();
      if (playbackTimer.current) {
        clearTimeout(playbackTimer.current);
      }
    };
  }, []);
  
  // Update gain node when volume changes
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);
  
  // Render the piano keys
  const renderPianoKeys = () => {
    const keys = getPianoKeys();
    
    return (
      <div className="relative flex h-32 w-full">
        {/* White keys */}
        <div className="flex w-full h-full">
          {keys.filter(key => !key.isSharp).map((key) => (
            <button
              key={key.note}
              className={`flex-1 border border-gray-300 rounded-b-sm ${
                currentNote === key.note ? "bg-primary" : "bg-white"
              } hover:bg-primary/20 active:bg-primary flex flex-col items-center justify-end pb-2`}
              onClick={() => handlePianoKeyClick(key)}
            >
              <span className="text-xs font-medium text-black">{key.label}</span>
            </button>
          ))}
        </div>
        
        {/* Black keys */}
        <div className="absolute top-0 flex w-full h-1/2 px-[1.5%]">
          {/* Spacing for C# */}
          <div className="flex-[7]" />
          <button
            className={`flex-[2] mx-[0.5%] ${
              currentNote === keys[1].note ? "bg-primary" : "bg-gray-800"
            } rounded hover:bg-gray-700 active:bg-primary`}
            onClick={() => handlePianoKeyClick(keys[1])}
          />
          {/* Spacing for D# */}
          <div className="flex-[3]" />
          <button
            className={`flex-[2] mx-[0.5%] ${
              currentNote === keys[3].note ? "bg-primary" : "bg-gray-800"
            } rounded hover:bg-gray-700 active:bg-primary`}
            onClick={() => handlePianoKeyClick(keys[3])}
          />
          {/* Spacing after D# */}
          <div className="flex-[7]" />
          {/* Spacing for F# */}
          <div className="flex-[7]" />
          <button
            className={`flex-[2] mx-[0.5%] ${
              currentNote === keys[6].note ? "bg-primary" : "bg-gray-800"
            } rounded hover:bg-gray-700 active:bg-primary`}
            onClick={() => handlePianoKeyClick(keys[6])}
          />
          {/* Spacing for G# */}
          <div className="flex-[3]" />
          <button
            className={`flex-[2] mx-[0.5%] ${
              currentNote === keys[8].note ? "bg-primary" : "bg-gray-800"
            } rounded hover:bg-gray-700 active:bg-primary`}
            onClick={() => handlePianoKeyClick(keys[8])}
          />
          {/* Spacing for A# */}
          <div className="flex-[3]" />
          <button
            className={`flex-[2] mx-[0.5%] ${
              currentNote === keys[10].note ? "bg-primary" : "bg-gray-800"
            } rounded hover:bg-gray-700 active:bg-primary`}
            onClick={() => handlePianoKeyClick(keys[10])}
          />
          {/* Spacing after A# */}
          <div className="flex-[7]" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-2">
      {/* Piano Keyboard */}
      {renderPianoKeys()}
      
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Octave Transpose */}
          <div className="space-y-2">
            <Label>Transpose</Label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOctaveOffset(Math.max(-2, octaveOffset - 1))}
                disabled={octaveOffset <= -2}
              >
                -
              </Button>
              <div className="flex-1 text-center font-medium">
                {octaveOffset > 0 ? `+${octaveOffset}` : octaveOffset} Octave
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOctaveOffset(Math.min(2, octaveOffset + 1))}
                disabled={octaveOffset >= 2}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Waveform Selector */}
          <div className="space-y-2">
            <Label>Waveform</Label>
            <Select value={waveform} onValueChange={value => setWaveform(value as WaveformType)}>
              <SelectTrigger>
                <SelectValue placeholder="Sine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sine">Sine</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="sawtooth">Sawtooth</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Volume</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={values => setVolume(values[0])}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="space-y-2">
            <Label>Recording</Label>
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleStartRecording}
                  className="flex items-center gap-1"
                  disabled={isPlayingRecording}
                >
                  <Mic className="h-4 w-4" /> Record
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleStopRecording}
                  className="flex items-center gap-1"
                >
                  <MicOff className="h-4 w-4" /> Stop
                </Button>
              )}
              
              {!isPlayingRecording ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={playRecording}
                  disabled={recordedNotes.length === 0 || isRecording}
                  className="flex items-center gap-1"
                >
                  <Play className="h-4 w-4" /> Play
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={stopPlayback}
                  className="flex items-center gap-1"
                >
                  <Square className="h-4 w-4" /> Stop
                </Button>
              )}
            </div>
          </div>
          
          {/* Save Recording (Only show when there are notes) */}
          {recordedNotes.length > 0 && (
            <div className="space-y-2">
              <Label>Save Recording</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Recording name"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  size={20}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveRecording}
                  disabled={!recordingName.trim() || !user}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          )}
          
          {/* Recording Status */}
          <div className="text-sm">
            {isRecording ? (
              <p className="text-destructive flex items-center gap-1">
                <span className="h-2 w-2 bg-destructive rounded-full animate-pulse"></span> Recording...
              </p>
            ) : recordedNotes.length > 0 ? (
              <p className="text-muted-foreground">
                {recordedNotes.length} notes recorded
              </p>
            ) : (
              <p className="text-muted-foreground">No recorded notes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
