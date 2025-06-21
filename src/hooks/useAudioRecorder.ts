
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
        audioLogger.log('🎤 Audio recorder: Ready for user interaction');
        
        // Debug audio capabilities
        debugAudioCapabilities();
      } catch (err) {
        audioLogger.error('🎤 Audio recorder: Failed to initialize', err);
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
  
  // Start recording with comprehensive error handling
  const startRecording = useCallback(async (): Promise<MediaStream> => {
    try {
      // Reset any previous errors
      setError(null);
      audioLogger.log('🎤 Starting recording process...');
      
      // Debug current state before starting
      debugAudioCapabilities();
      
      // Initialize audio system with user interaction
      const audioContext = await initializeAudioSystem();
      audioContextRef.current = audioContext;
      audioLogger.log('🎤 AudioContext initialized for recording');
      
      // Request microphone access with enhanced error handling
      audioLogger.log('🎤 Requesting microphone access...');
      const stream = await requestMicrophoneAccess();
      if (!stream) {
        throw new Error('Failed to access microphone - no stream returned');
      }
      
      mediaStreamRef.current = stream;
      audioLogger.log('🎤 Microphone stream obtained successfully');
      
      // Verify MediaRecorder support
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }
      
      // Check supported MIME types
      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = 'audio/webm;codecs=opus'; // default
      for (const mimeType of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          audioLogger.log(`🎤 Using MIME type: ${mimeType}`);
          break;
        }
      }
      
      if (!MediaRecorder.isTypeSupported(selectedMimeType)) {
        audioLogger.warn('🎤 No supported MIME type found, using default');
      }
      
      // Create and configure the MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // Reset audio chunks array
      
      // Set up comprehensive event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          audioLogger.log(`🎤 Audio data chunk received: ${event.data.size} bytes`);
        } else {
          audioLogger.warn('🎤 Received empty or invalid data chunk');
        }
      };
      
      mediaRecorder.onerror = (event) => {
        audioLogger.error('🎤 MediaRecorder error:', event);
        const error = new Error('Recording failed due to MediaRecorder error');
        setError(error);
      };
      
      mediaRecorder.onstart = () => {
        audioLogger.log('🎤 MediaRecorder started successfully');
      };
      
      mediaRecorder.onstop = () => {
        audioLogger.log('🎤 MediaRecorder stopped');
      };
      
      mediaRecorder.onpause = () => {
        audioLogger.log('🎤 MediaRecorder paused');
      };
      
      mediaRecorder.onresume = () => {
        audioLogger.log('🎤 MediaRecorder resumed');
      };
      
      // Start recording with data collection interval
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      audioLogger.log('🎤 Recording started successfully');
      audioLogger.log(`🎤 MediaRecorder state: ${mediaRecorder.state}`);
      
      return stream;
    } catch (error) {
      audioLogger.error('🎤 Error starting recording:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const recordingError = new Error(`Recording failed: ${errorMessage}`);
      setError(recordingError);
      throw recordingError;
    }
  }, []);
  
  // Stop recording with enhanced error handling
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        audioLogger.log('🎤 No active recording to stop');
        setIsRecording(false);
        resolve(null);
        return;
      }
      
      audioLogger.log(`🎤 Stopping recording... Current state: ${mediaRecorder.state}`);
      
      // Set up stop handler
      const handleStop = () => {
        try {
          audioLogger.log(`🎤 Processing ${audioChunksRef.current.length} audio chunks`);
          
          if (audioChunksRef.current.length === 0) {
            audioLogger.warn('🎤 No audio chunks available');
            resolve(null);
            return;
          }
          
          // Calculate total size
          const totalSize = audioChunksRef.current.reduce((size, chunk) => size + chunk.size, 0);
          audioLogger.log(`🎤 Total audio data size: ${totalSize} bytes`);
          
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          // Clean up media stream
          if (mediaStreamRef.current) {
            releaseMicrophone(mediaStreamRef.current);
            mediaStreamRef.current = null;
          }
          
          setIsRecording(false);
          audioLogger.log(`🎤 Recording stopped successfully, blob created: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
          resolve(audioBlob);
        } catch (error) {
          audioLogger.error('🎤 Error processing recording:', error);
          reject(error);
        }
      };
      
      // Set up timeout for stop operation
      const stopTimeout = setTimeout(() => {
        audioLogger.error('🎤 Stop operation timed out');
        reject(new Error('Recording stop operation timed out'));
      }, 5000);
      
      // When stopped, create a blob from the audio chunks
      mediaRecorder.onstop = () => {
        clearTimeout(stopTimeout);
        handleStop();
      };
      
      // Stop recording
      try {
        mediaRecorder.stop();
      } catch (error) {
        clearTimeout(stopTimeout);
        audioLogger.error('🎤 Error calling stop():', error);
        reject(error);
      }
    });
  }, []);
  
  // Pause recording (if needed)
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      audioLogger.log('🎤 Recording paused');
    }
  }, []);
  
  // Resume recording (if needed)
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      audioLogger.log('🎤 Recording resumed');
    }
  }, []);
  
  // Check if the browser supports recording
  const isBrowserSupported = useCallback(() => {
    const isSupported = !!(
      navigator.mediaDevices && 
      navigator.mediaDevices.getUserMedia && 
      window.MediaRecorder &&
      window.isSecureContext
    );
    audioLogger.log('🎤 Browser recording support check:', {
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      MediaRecorder: !!window.MediaRecorder,
      secureContext: window.isSecureContext,
      overall: isSupported
    });
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
