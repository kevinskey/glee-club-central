
import { useState, useRef, useCallback, useEffect } from 'react';
import { audioLogger, requestMicrophoneAccess, releaseMicrophone, initializeAudioSystem, cleanupAudioSystem, debugAudioCapabilities } from '@/utils/audioUtils';

export function useAudioRecorder() {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs to hold recording resources
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Initialize audio system on mount with proper user interaction handling
  useEffect(() => {
    let mounted = true;
    
    const initAudio = async () => {
      try {
        // Don't auto-initialize - wait for user interaction
        setIsInitialized(true);
        audioLogger.log('Audio recorder: Ready for user interaction');
        
        // Debug audio capabilities
        debugAudioCapabilities();
      } catch (err) {
        audioLogger.error('Audio recorder: Failed to initialize', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };
    
    initAudio();
    
    // Clean up on unmount
    return () => {
      mounted = false;
      
      if (mediaStreamRef.current) {
        releaseMicrophone(mediaStreamRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current = null;
      }
    };
  }, []);
  
  // Start recording with proper AudioContext initialization
  const startRecording = useCallback(async (): Promise<MediaStream> => {
    try {
      // Reset any previous errors
      setError(null);
      audioLogger.log('Starting recording process...');
      
      // Initialize audio system with user interaction
      const audioContext = await initializeAudioSystem();
      audioContextRef.current = audioContext;
      audioLogger.log('AudioContext initialized for recording');
      
      // Request microphone access
      const stream = await requestMicrophoneAccess();
      if (!stream) {
        throw new Error('Failed to access microphone');
      }
      
      mediaStreamRef.current = stream;
      audioLogger.log('Microphone stream obtained');
      
      // Create and configure the MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // Reset audio chunks array
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          audioLogger.log('Audio data chunk received:', event.data.size);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        audioLogger.error('MediaRecorder error:', event);
        setError(new Error('Recording failed'));
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      audioLogger.log('Recording started successfully');
      
      return stream;
    } catch (error) {
      audioLogger.error('Error starting recording:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, []);
  
  // Stop recording
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        audioLogger.log('No active recording to stop');
        setIsRecording(false);
        resolve(null);
        return;
      }
      
      // When stopped, create a blob from the audio chunks
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        
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
      audioLogger.log('Stopping recording...');
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
  
  // Check if the browser supports recording
  const isBrowserSupported = useCallback(() => {
    const isSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    audioLogger.log('Browser audio support check:', isSupported);
    return isSupported;
  }, []);
  
  return {
    isRecording,
    isInitialized,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isBrowserSupported
  };
}
