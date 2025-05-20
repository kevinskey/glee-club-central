
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Scissors, RefreshCcw } from 'lucide-react';

interface AudioEditorProps {
  audioUrl: string;
  onEdit: (newAudioUrl: string) => void;
}

export function AudioEditor({ audioUrl, onEdit }: AudioEditorProps) {
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [volume, setVolume] = useState(100);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  
  // Load audio for editing
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUrl) return;
      
      try {
        // Create audio context if not exists
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        // Fetch audio data
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode audio data
        audioContextRef.current.decodeAudioData(arrayBuffer, (buffer) => {
          audioBufferRef.current = buffer;
          setAudioDuration(buffer.duration);
        });
        
      } catch (error) {
        console.error("Error loading audio for editing:", error);
        toast.error("Failed to load audio for editing");
      }
    };
    
    loadAudio();
    
    // Clean up
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [audioUrl]);
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Apply trim to audio
  const handleTrim = async () => {
    if (!audioContextRef.current || !audioBufferRef.current) {
      toast.error("Audio not loaded for editing");
      return;
    }
    
    try {
      toast.loading("Applying edits...");
      
      // Calculate trim points in seconds
      const startTime = (trimStart / 100) * audioBufferRef.current.duration;
      const endTime = (trimEnd / 100) * audioBufferRef.current.duration;
      const newDuration = endTime - startTime;
      
      // Create a new buffer for trimmed audio
      const newBuffer = audioContextRef.current.createBuffer(
        audioBufferRef.current.numberOfChannels,
        Math.floor(newDuration * audioBufferRef.current.sampleRate),
        audioBufferRef.current.sampleRate
      );
      
      // Copy and apply volume
      for (let channel = 0; channel < audioBufferRef.current.numberOfChannels; channel++) {
        const channelData = audioBufferRef.current.getChannelData(channel);
        const newChannelData = newBuffer.getChannelData(channel);
        
        for (let i = 0; i < newBuffer.length; i++) {
          const oldIndex = i + Math.floor(startTime * audioBufferRef.current.sampleRate);
          if (oldIndex < channelData.length) {
            newChannelData[i] = channelData[oldIndex] * (volume / 100);
          }
        }
      }
      
      // Convert buffer to WAV
      const offlineContext = new OfflineAudioContext(
        newBuffer.numberOfChannels,
        newBuffer.length,
        newBuffer.sampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = newBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to WAV and create blob URL
      const wavBlob = await bufferToWave(renderedBuffer, renderedBuffer.length);
      const newAudioUrl = URL.createObjectURL(wavBlob);
      
      toast.dismiss();
      toast.success("Audio edited successfully");
      
      // Call the callback with the new URL
      onEdit(newAudioUrl);
      
    } catch (error) {
      toast.dismiss();
      console.error("Error trimming audio:", error);
      toast.error("Failed to edit audio");
    }
  };
  
  // Reset to original audio
  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(100);
    setVolume(100);
  };
  
  // Helper function to convert AudioBuffer to WAV Blob
  const bufferToWave = (buffer: AudioBuffer, len: number): Promise<Blob> => {
    const numOfChan = buffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const outBuffer = new ArrayBuffer(length);
    const view = new DataView(outBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;
    
    // Write WAV header
    setUint32(view, offset, 0x46464952); // "RIFF"
    offset += 4;
    setUint32(view, offset, length - 8); // file length - 8
    offset += 4;
    setUint32(view, offset, 0x45564157); // "WAVE"
    offset += 4;
    setUint32(view, offset, 0x20746d66); // "fmt "
    offset += 4;
    setUint32(view, offset, 16); // format chunk length
    offset += 4;
    setUint16(view, offset, 1); // PCM
    offset += 2;
    setUint16(view, offset, numOfChan); // Channels
    offset += 2;
    setUint32(view, offset, buffer.sampleRate); // Sample rate
    offset += 4;
    setUint32(view, offset, buffer.sampleRate * numOfChan * 2); // Byte rate
    offset += 4;
    setUint16(view, offset, numOfChan * 2); // Block align
    offset += 2;
    setUint16(view, offset, 16); // Bits per sample
    offset += 2;
    setUint32(view, offset, 0x61746164); // "data"
    offset += 4;
    setUint32(view, offset, len * numOfChan * 2); // data chunk length
    offset += 4;
    
    // Extract channels
    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    // Interleave channels and convert to 16-bit PCM
    while (pos < len) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][pos])) * 0x7FFF;
        sample = sample < 0 ? 0x10000 + sample : sample;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
      pos++;
    }
    
    return new Promise((resolve) => {
      resolve(new Blob([outBuffer], { type: "audio/wav" }));
    });
  };
  
  // Helper function to set little-endian values
  const setUint16 = (view: DataView, offset: number, value: number) => {
    view.setUint16(offset, value, true);
  };
  
  const setUint32 = (view: DataView, offset: number, value: number) => {
    view.setUint32(offset, value, true);
  };
  
  return (
    <Card className="p-4 bg-muted/30">
      <h3 className="text-sm font-medium mb-4">Edit Audio</h3>
      
      <div className="space-y-4">
        {/* Trim Controls */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Trim Range</Label>
            <span className="text-xs text-muted-foreground">
              {formatTime((trimStart / 100) * audioDuration)} - {formatTime((trimEnd / 100) * audioDuration)}
            </span>
          </div>
          
          <div className="pt-4 px-2">
            <Slider
              min={0}
              max={100}
              step={0.1}
              value={[trimStart, trimEnd]}
              onValueChange={(values) => {
                // Ensure minimum range of 5%
                if (values[1] - values[0] >= 5) {
                  setTrimStart(values[0]);
                  setTrimEnd(values[1]);
                }
              }}
              className="my-4"
            />
          </div>
        </div>
        
        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Volume</Label>
            <span className="text-xs text-muted-foreground">{volume}%</span>
          </div>
          
          <Slider
            min={0}
            max={200}
            step={1}
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="default" 
            onClick={handleTrim}
            className="flex-1"
          >
            <Scissors className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
