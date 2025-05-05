
import React from 'react';
import { Square, Mic, MicOff, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioPageCategory } from '@/types/audio';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useRecordingSave } from '@/hooks/useRecordingSave';

interface RecordingSectionProps {
  onRecordingSaved: (category?: Exclude<AudioPageCategory, "all">) => void;
}

export function RecordingSection({ onRecordingSaved }: RecordingSectionProps) {
  const {
    isRecording,
    microphoneActive,
    recordingTime,
    audioURL,
    isPlaying,
    audioRef,
    initializeMicrophone,
    startRecording,
    stopRecording,
    releaseMicrophone,
    togglePlayback,
    formatTime
  } = useAudioRecorder();

  const {
    recordingName,
    setRecordingName,
    recordingCategory,
    setRecordingCategory,
    isSaving,
    saveRecording
  } = useRecordingSave({
    onSaveComplete: () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      const savedCategory = recordingCategory;
      onRecordingSaved(savedCategory);
    }
  });

  // Handle save recording
  const handleSaveRecording = async () => {
    const savedCategory = await saveRecording(audioURL);
    if (savedCategory) {
      onRecordingSaved(savedCategory);
    }
  };

  // Discard recording
  const discardRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      onRecordingSaved();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {microphoneActive ? (
            <Mic className="h-5 w-5 text-green-500" />
          ) : (
            <MicOff className="h-5 w-5 text-gray-500" />
          )} 
          Record Audio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {!microphoneActive && !isRecording && !audioURL && (
              <Button 
                onClick={initializeMicrophone}
                className="gap-2"
              >
                <Mic className="h-4 w-4" /> Activate Microphone
              </Button>
            )}
            
            {microphoneActive && !isRecording && !audioURL && (
              <Button 
                onClick={startRecording}
                variant="default"
                className="gap-2"
              >
                <Mic className="h-4 w-4" /> Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button 
                variant="destructive" 
                onClick={stopRecording}
                className="gap-2"
              >
                <Square className="h-4 w-4" /> Stop Recording
              </Button>
            )}
            
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span>Recording: {formatTime(recordingTime)}</span>
              </div>
            )}
            
            {microphoneActive && !isRecording && (
              <div className="flex items-center gap-2 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>Microphone active</span>
              </div>
            )}
          </div>
          
          {audioURL && (
            <div className="space-y-4">
              <Separator />
              <div className="grid gap-4">
                <div className="flex flex-col space-y-4">
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
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
