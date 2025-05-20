import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { playTone, getNoteFrequency, NoteEvent, RecordingData } from "@/utils/audioUtils";
import { Square, Triangle, Disc, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Piano key data
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

interface PitchPipeProps {
  onClose?: () => void;
  audioContextRef?: React.RefObject<AudioContext | null>;
}

export function PitchPipe({ onClose, audioContextRef }: PitchPipeProps) {
  // Audio state
  const [octave, setOctave] = useState<number>(4);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.5);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [recordings, setRecordings] = useState<{id: string, name: string, data: RecordingData}[]>([]);
  const [events, setEvents] = useState<NoteEvent[]>([]);
  const recordStartTimeRef = useRef<number | null>(null);
  
  // Auth
  const { isAuthenticated } = useAuth();
  
  // Get or create audio context
  const getAudioContext = (): AudioContext => {
    // Use the provided audio context if available
    if (audioContextRef?.current) {
      return audioContextRef.current;
    }
    
    // Otherwise create or use our local audio context
    if (!localAudioContextRef.current) {
      try {
        localAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        toast.error("WebAudio API is not supported in this browser");
        throw error;
      }
    }
    
    return localAudioContextRef.current;
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Close the local audio context if we created one
      if (localAudioContextRef.current && !audioContextRef) {
        localAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioContextRef]);
  
  // Load user's recordings
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecordings();
    }
  }, [isAuthenticated]);
  
  const fetchRecordings = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('pitch_recordings')
        .select('id, name, data')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };
  
  // Handle playing notes
  const playNote = (note: string) => {
    try {
      const audioContext = getAudioContext();
      
      // Resume the audio context if it's suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(console.error);
      }
      
      const noteName = `${note}${octave}`;
      const frequency = getNoteFrequency(note, octave);
      
      playTone(audioContext, frequency, waveform, 1, volume);
      
      // If recording, save this event
      if (isRecording) {
        const now = Date.now();
        const relativeTime = recordStartTimeRef.current ? now - recordStartTimeRef.current : 0;
        
        const noteEvent: NoteEvent = {
          note: noteName,
          frequency,
          waveform,
          timestamp: relativeTime,
          duration: 1,
          volume
        };
        
        setEvents(prev => [...prev, noteEvent]);
      }
    } catch (error) {
      console.error('Error playing note:', error);
      toast.error("Error playing note");
    }
  };
  
  // Handle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setEvents([]);
    recordStartTimeRef.current = Date.now();
    toast.info("Recording started. Play notes to record them.");
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped");
  };
  
  const saveRecording = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to save recordings");
      return;
    }
    
    if (events.length === 0) {
      toast.error("No notes recorded");
      return;
    }
    
    if (!recordingName.trim()) {
      toast.error("Please enter a name for this recording");
      return;
    }
    
    const recordingData: RecordingData = {
      events,
      totalDuration: events.length > 0 ? 
        Math.max(...events.map(e => e.timestamp)) / 1000 : 0,
      createdAt: new Date().toISOString()
    };
    
    try {
      const { error } = await supabase
        .from('pitch_recordings')
        .insert({
          name: recordingName,
          data: recordingData
        });
      
      if (error) throw error;
      
      toast.success("Recording saved");
      setRecordingName('');
      setEvents([]);
      fetchRecordings();
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error("Failed to save recording");
    }
  };
  
  const playRecording = async (recordingData: RecordingData) => {
    try {
      const audioContext = getAudioContext();
      
      // Resume the audio context if it's suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(console.error);
      }
      
      const startTime = audioContext.currentTime;
      
      recordingData.events.forEach(event => {
        setTimeout(() => {
          playTone(
            audioContext, 
            event.frequency,
            event.waveform,
            event.duration,
            event.volume
          );
        }, event.timestamp);
      });
      
      toast.info("Playing recording");
    } catch (error) {
      console.error('Error playing recording:', error);
      toast.error("Error playing recording");
    }
  };
  
  const deleteRecording = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pitch_recordings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Recording deleted");
      fetchRecordings();
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error("Failed to delete recording");
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  return (
    <div className="w-full p-2 space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
          <Select value={waveform} onValueChange={(val) => setWaveform(val as OscillatorType)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Waveform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sine">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4" />
                  <span>Sine</span>
                </div>
              </SelectItem>
              <SelectItem value="square">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  <span>Square</span>
                </div>
              </SelectItem>
              <SelectItem value="triangle">
                <div className="flex items-center gap-2">
                  <Triangle className="w-4 h-4" />
                  <span>Triangle</span>
                </div>
              </SelectItem>
              <SelectItem value="sawtooth">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20L21 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Sawtooth</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-1">
            <button 
              className="w-8 h-8 flex items-center justify-center border rounded-md"
              onClick={() => setOctave(prev => Math.max(2, prev - 1))}
              disabled={octave <= 2}
            >
              -
            </button>
            <span className="w-8 text-center">
              {octave}
            </span>
            <button 
              className="w-8 h-8 flex items-center justify-center border rounded-md"
              onClick={() => setOctave(prev => Math.min(6, prev + 1))}
              disabled={octave >= 6}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm">Volume:</span>
          <Slider 
            value={[volume]} 
            max={1} 
            step={0.01}
            onValueChange={([val]) => setVolume(val)} 
            className="w-[120px]" 
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <span className="h-4 w-4 rounded-full animate-pulse bg-red-500 mr-1"></span>
                Stop
              </>
            ) : (
              <>
                <span className="h-4 w-4 rounded-full bg-red-500 mr-1"></span>
                Record
              </>
            )}
          </Button>
          
          {events.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (events.length > 0) {
                  playRecording({
                    events,
                    totalDuration: events.length > 0 ? 
                      Math.max(...events.map(e => e.timestamp)) / 1000 : 0,
                    createdAt: new Date().toISOString()
                  });
                }
              }}
            >
              <Play className="h-4 w-4 mr-1" />
              Playback
            </Button>
          )}
        </div>
      </div>
      
      {/* Piano keyboard */}
      <div className="relative h-36 sm:h-48 overflow-hidden flex">
        {PIANO_KEYS.map((key, idx) => {
          if (!key.isSharp) {
            return (
              <button
                key={`${key.note}-${octave}`}
                className="flex-1 bg-white border border-gray-300 rounded-b hover:bg-gray-100 active:bg-gray-200 relative flex flex-col-reverse"
                onClick={() => playNote(key.note)}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {key.note}{octave}
                </span>
              </button>
            );
          }
          return null;
        })}
        
        {/* Black keys */}
        <div className="absolute top-0 left-0 w-full h-3/5 flex">
          <div className="w-1/7 flex-shrink-0"></div> {/* C */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('C#')}
          />
          <div className="w-1/7 flex-shrink-0"></div> {/* D */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('D#')}
          />
          <div className="w-1/7 flex-shrink-0"></div>
          <div className="w-1/7 flex-shrink-0"></div> {/* Skip E to F */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('F#')}
          />
          <div className="w-1/7 flex-shrink-0"></div> {/* G */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('G#')}
          />
          <div className="w-1/7 flex-shrink-0"></div> {/* A */}
          <button
            className="w-2/3 mx-auto h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 z-10 rounded-b"
            onClick={() => playNote('A#')}
          />
          <div className="w-1/7 flex-shrink-0"></div> {/* B */}
        </div>
      </div>
      
      {/* Save recording control */}
      {isAuthenticated && events.length > 0 && (
        <div className="flex gap-2 items-center mt-4">
          <Input 
            placeholder="Recording name"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveRecording} disabled={!recordingName.trim()}>
            Save
          </Button>
        </div>
      )}
      
      {/* Saved recordings */}
      {isAuthenticated && recordings.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Saved Recordings</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {recordings.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between gap-2 border p-2 rounded-md">
                <span className="text-sm truncate flex-1">{rec.name}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => playRecording(rec.data)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteRecording(rec.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
