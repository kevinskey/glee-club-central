
import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { SoundFontManager, AVAILABLE_INSTRUMENTS } from '@/lib/audio/SoundFont';
import * as Tone from 'tone';

export interface AudioSettings {
  masterVolume: number;
  latency: number;
  sampleRate: number;
}

export function useAdvancedAudio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    masterVolume: 0.7,
    latency: 0.1,
    sampleRate: 44100
  });
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const soundFontManagerRef = useRef<SoundFontManager | null>(null);
  const activeNotesRef = useRef<Map<string, any>>(new Map());
  const initializationAttemptedRef = useRef(false);
  
  const initialize = useCallback(async () => {
    if (isInitialized || isLoading || initializationAttemptedRef.current) return;
    
    initializationAttemptedRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Get audio engine instance
      audioEngineRef.current = AudioEngine.getInstance();
      await audioEngineRef.current.initialize();
      
      // Create SoundFont manager - ensure we have a proper AudioContext
      const context = audioEngineRef.current.getContext();
      if (!context || !context.rawContext) {
        throw new Error('Audio context not available');
      }
      
      const audioContext = context.rawContext as AudioContext;
      soundFontManagerRef.current = new SoundFontManager(audioContext);
      
      // Set up Tone.js settings
      Tone.Transport.bpm.value = 120;
      Tone.context.lookAhead = audioSettings.latency;
      
      // Preload essential instruments
      const essentialInstruments = [
        'acoustic_grand_piano',
        'choir_aahs',
        'violin',
        'cello',
        'acoustic_guitar_nylon'
      ];
      
      await soundFontManagerRef.current.preloadInstruments(essentialInstruments);
      
      setIsInitialized(true);
      console.log('Advanced audio system initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown audio initialization error';
      setError(errorMessage);
      console.error('Failed to initialize advanced audio:', err);
      // Don't reset initialization flag on error - allow retry
      initializationAttemptedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [audioSettings.latency]);
  
  const playNote = useCallback(async (
    note: string,
    velocity: number = 127,
    duration?: number,
    instrumentId: string = 'acoustic_grand_piano'
  ) => {
    if (!soundFontManagerRef.current || !isInitialized) {
      console.warn('Audio system not ready for note playback');
      return;
    }
    
    try {
      let instrument = soundFontManagerRef.current.getLoadedInstrument(instrumentId);
      
      if (!instrument) {
        instrument = await soundFontManagerRef.current.loadInstrument(instrumentId);
      }
      
      const noteKey = `${note}-${instrumentId}`;
      
      // Stop existing note if playing
      if (activeNotesRef.current.has(noteKey)) {
        const existingNote = activeNotesRef.current.get(noteKey);
        if (existingNote && typeof existingNote.stop === 'function') {
          existingNote.stop();
        }
      }
      
      // Play new note
      const playedNote = instrument.play(note, Tone.now(), {
        gain: (velocity / 127) * audioSettings.masterVolume,
        duration: duration
      });
      
      activeNotesRef.current.set(noteKey, playedNote);
      
      // Auto-cleanup after duration or default timeout
      const cleanupTime = duration ? duration * 1000 : 5000;
      setTimeout(() => {
        activeNotesRef.current.delete(noteKey);
      }, cleanupTime);
      
      return playedNote;
    } catch (err) {
      console.error('Failed to play note:', err);
    }
  }, [isInitialized, audioSettings.masterVolume]);
  
  const stopNote = useCallback((note: string, instrumentId: string = 'acoustic_grand_piano') => {
    const noteKey = `${note}-${instrumentId}`;
    const activeNote = activeNotesRef.current.get(noteKey);
    
    if (activeNote && typeof activeNote.stop === 'function') {
      activeNote.stop();
      activeNotesRef.current.delete(noteKey);
    }
  }, []);
  
  const stopAllNotes = useCallback(() => {
    activeNotesRef.current.forEach((note, key) => {
      if (note && typeof note.stop === 'function') {
        note.stop();
      }
    });
    activeNotesRef.current.clear();
  }, []);
  
  const loadInstrument = useCallback(async (instrumentId: string) => {
    if (!soundFontManagerRef.current) return null;
    
    try {
      return await soundFontManagerRef.current.loadInstrument(instrumentId);
    } catch (err) {
      console.error(`Failed to load instrument ${instrumentId}:`, err);
      return null;
    }
  }, []);
  
  const updateAudioSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...newSettings }));
    
    // Apply settings to Tone.js
    if (newSettings.latency !== undefined) {
      Tone.context.lookAhead = newSettings.latency;
    }
  }, []);
  
  const dispose = useCallback(() => {
    stopAllNotes();
    
    if (soundFontManagerRef.current) {
      soundFontManagerRef.current.dispose();
    }
    
    if (audioEngineRef.current) {
      audioEngineRef.current.dispose();
    }
    
    setIsInitialized(false);
    initializationAttemptedRef.current = false;
  }, [stopAllNotes]);
  
  // Auto-initialize on mount
  useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      initialize();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      dispose();
    };
  }, []);
  
  // Retry initialization if there was an error
  const retryInitialization = useCallback(() => {
    initializationAttemptedRef.current = false;
    setError(null);
    initialize();
  }, [initialize]);
  
  return {
    isInitialized,
    isLoading,
    error,
    audioSettings,
    availableInstruments: AVAILABLE_INSTRUMENTS,
    playNote,
    stopNote,
    stopAllNotes,
    loadInstrument,
    updateAudioSettings,
    initialize,
    retryInitialization,
    dispose,
    audioEngine: audioEngineRef.current,
    soundFontManager: soundFontManagerRef.current
  };
}
