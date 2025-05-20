
import { useState, useRef, useCallback, useEffect } from 'react';
import { audioLogger, requestMicrophoneAccess, releaseMicrophone } from '@/utils/audioUtils';

export function useAudioRecorder() {
  // State
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs to hold recording resources
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize audio system on mount
  useEffect(() => {
    // Create the audio context directly
    try {
      audioContextRef.current = new AudioContext();
      audioLogger.log('Audio recorder: Audio context created');
    } catch (error) {
      audioLogger.error('Audio recorder: Failed to create audio context', error);
    }
    
    // Clean up on unmount
    return () => {
      if (mediaStreamRef.current) {
        releaseMicrophone(mediaStreamRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  // Start recording
  const startRecording = useCallback(async (): Promise<MediaStream | null> => {
    try {
      // Request microphone access
      const stream = await requestMicrophoneAccess();
      if (!stream) {
        throw new Error('Failed to access microphone');
      }
      
      mediaStreamRef.current = stream;
      
      // Create and configure the MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // Reset audio chunks array
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      audioLogger.log('Recording started');
      
      return stream;
    } catch (error) {
      audioLogger.error('Error starting recording:', error);
      throw error;
    }
  }, []);
  
  // Stop recording
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }
      
      // When stopped, create a blob from the audio chunks
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Clean up
        if (mediaStreamRef.current) {
          releaseMicrophone(mediaStreamRef.current);
          mediaStreamRef.current = null;
        }
        
        setIsRecording(false);
        audioLogger.log('Recording stopped, blob created:', audioBlob.size);
        resolve(audioBlob);
      };
      
      // Stop recording
      mediaRecorder.stop();
    });
  }, []);
  
  // Pause recording (if needed)
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      audioLogger.log('Recording paused');
    }
  }, []);
  
  // Resume recording (if needed)
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      audioLogger.log('Recording resumed');
    }
  }, []);
  
  return {
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  };
}
