
import React from 'react';
import { Play, Square, Save, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPageCategory } from '@/types/audio';

interface AudioSaveControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlayback: () => void;
  recordingName: string;
  setRecordingName: (name: string) => void;
  recordingCategory: Exclude<AudioPageCategory, "all">;
  setRecordingCategory: (category: Exclude<AudioPageCategory, "all">) => void;
  isSaving: boolean;
  handleSaveRecording: () => void;
  discardRecording: () => void;
}

export function AudioSaveControls({
  audioRef,
  isPlaying,
  setIsPlaying,
  togglePlayback,
  recordingName,
  setRecordingName,
  recordingCategory,
  setRecordingCategory,
  isSaving,
  handleSaveRecording,
  discardRecording,
}: AudioSaveControlsProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={togglePlayback}
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Square className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play
            </>
          )}
        </Button>
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
        <div className="flex-1">
          <Input 
            type="text" 
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            className="w-full"
            placeholder="Recording name"
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="recording-category">Save to Category</Label>
        <Select 
          value={recordingCategory}
          onValueChange={(value) => setRecordingCategory(value as Exclude<AudioPageCategory, "all">)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="part_tracks">Part Tracks</SelectItem>
            <SelectItem value="recordings">Recordings</SelectItem>
            <SelectItem value="my_tracks">My Tracks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={discardRecording}
          className="gap-2"
        >
          <MicOff className="h-4 w-4" /> Discard Recording
        </Button>
        <Button 
          onClick={handleSaveRecording}
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Recording'}
        </Button>
      </div>
    </div>
  );
}
