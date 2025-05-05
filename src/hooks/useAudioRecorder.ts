
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function useAudioRecorder() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize microphone
  const initializeMicrophone = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      setMicrophoneActive(true);
      
      // Show success message
      toast({
        title: "Microphone activated",
        description: "Your microphone is ready for recording.",
      });
      
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({ 
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive"
      });
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
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        if (audioRef.current) {
          audioRef.current.src = url;
        }
      };

      // Start the recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({ 
        title: "Recording failed",
        description: "Could not start recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Release microphone
  const releaseMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setMicrophoneActive(false);
    }
  };

  // Play/pause recording
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      releaseMicrophone();
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return {
    isRecording,
    microphoneActive,
    recordingTime,
    audioURL,
    isPlaying,
    setIsPlaying, // Export this function as well to fix the error
    audioRef,
    initializeMicrophone,
    startRecording,
    stopRecording,
    releaseMicrophone,
    togglePlayback,
    formatTime
  };
}
