
import { useRef, useCallback } from "react";
import { toast } from "sonner";

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(console.error);
        }
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        toast.error("Could not initialize audio. Please check browser permissions.");
      }
    }
    return audioContextRef.current;
  }, []);

  const getAudioContext = useCallback(() => {
    return audioContextRef.current;
  }, []);

  return {
    audioContextRef,
    initializeAudioContext,
    getAudioContext
  };
}
