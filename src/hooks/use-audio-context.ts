
import { useRef, useCallback } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        // Create audio context with fallback for older browsers
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        console.log('Audio context created successfully');
      } catch (error) {
        console.error('Failed to create audio context:', error);
      }
    }

    // Resume audio context if suspended (required for mobile browsers)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }

    return audioContextRef.current;
  }, []);

  return {
    audioContextRef,
    initializeAudioContext
  };
}
