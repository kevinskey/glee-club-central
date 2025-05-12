
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  audioLogger,
  initializeAudioSystem, 
  requestMicrophoneAccess, 
  releaseMicrophone 
} from '@/utils/audioUtils';

export function useAudioRecorder() {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [isInitialized, setIsInitialized] = useState(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        const state = await initializeAudioSystem();
        setPermissionState(state.microphonePermission);
        setIsInitialized(state.initialized);
      } catch (error) {
        audioLogger.error('Error initializing audio in hook:', error);
      }
    };
    
    initAudio();
    
    return () => {
      // Clean up on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      releaseMicrophone(streamRef.current);
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, []);

  // Initialize microphone
  const initializeMicrophone = async () => {
    try {
      // Log audio devices before requesting access
      audioLogger.debug('Audio devices before mic access:');

      // Request microphone access with constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await requestMicrophoneAccess(constraints);
      
      if (!stream) {
        return null;
      }
      
      streamRef.current = stream;
      setMicrophoneActive(true);
      
      // Check what we got
      const audioTracks = stream.getAudioTracks();
      audioLogger.debug('Microphone tracks:', audioTracks.length);
      
      if (audioTracks.length > 0) {
        const track = audioTracks[0];
        audioLogger.debug('Track settings:', track.getSettings());
        audioLogger.debug('Track constraints:', track.getConstraints());
      }
      
      return stream;
    } catch (error) {
      audioLogger.error('Error initializing microphone:', error);
      setMicrophoneActive(false);
      return null;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Get stream (or reuse existing one)
      const stream = streamRef.current || await initializeMicrophone();
      if (!stream) return;
      
      audioLogger.log('Starting recording...');
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioLogger.debug(`Received ${e.data.size} bytes of audio data`);
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        audioLogger.log('Recording stopped, processing audio...');
        
        if (audioChunksRef.current.length === 0) {
          audioLogger.warn('No audio data captured during recording');
          toast.error("No audio data was captured. Please try again.");
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioLogger.debug(`Created audio blob: ${audioBlob.size} bytes`);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioLogger.debug('Audio URL set on audio element');
        }
      };
      
      mediaRecorder.onerror = (event) => {
        audioLogger.error('MediaRecorder error:', event);
        toast.error("Recording error occurred");
      };

      // Start the recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      audioLogger.log('MediaRecorder started');
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      audioLogger.error('Error starting recording:', error);
      toast.error("Could not start recording. Please try again.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioLogger.log('Stopping recording...');
      
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        
        // Stop the timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        audioLogger.log('Recording stopped successfully');
      } catch (error) {
        audioLogger.error('Error stopping recording:', error);
      }
    }
  };

  // Play/pause recording
  const togglePlayback = () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          audioLogger.debug('Playback paused');
        } else {
          audioRef.current.play()
            .catch(error => {
              audioLogger.error('Error playing audio:', error);
              toast.error("Could not play audio");
            });
          audioLogger.debug('Playback started');
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        audioLogger.error('Error toggling playback:', error);
      }
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Test audio output system
  const testAudioOutput = async () => {
    try {
      if (!audioRef.current) {
        audioLogger.warn('Audio element not available for testing');
        return;
      }
      
      // Create a short beep for testing
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.2; // Volume
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Play for 500ms
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
      
      toast.success("Audio output system is working");
      audioLogger.log('Audio output test successful');
    } catch (error) {
      audioLogger.error('Audio output test failed:', error);
      toast.error("Could not test audio output");
    }
  };

  return {
    isRecording,
    microphoneActive,
    recordingTime,
    audioURL,
    isPlaying,
    permissionState,
    isInitialized,
    setIsPlaying,
    audioRef,
    initializeMicrophone,
    startRecording,
    stopRecording,
    releaseMicrophone,
    togglePlayback,
    formatTime,
    testAudioOutput
  };
}
