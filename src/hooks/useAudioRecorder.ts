
import { useState } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  return {
    isRecording,
    audioBlob,
    startRecording: () => {
      console.log('Audio recording functionality has been removed');
    },
    stopRecording: () => {
      console.log('Audio recording functionality has been removed');
    },
    resetRecording: () => {
      setAudioBlob(null);
    }
  };
}
