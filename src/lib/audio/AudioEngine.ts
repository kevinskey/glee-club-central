
import * as Tone from 'tone';

export class AudioEngine {
  private static instance: AudioEngine;
  private initialized = false;
  private midiEnabled = false;
  
  private constructor() {}
  
  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('Initializing Tone.js...');
      
      // Start Tone.js - this is the most critical step
      await Tone.start();
      console.log('Tone.js started successfully');
      
      // Set up basic audio settings
      Tone.Transport.bpm.value = 120;
      
      // MIDI is optional - don't fail if it's not available
      try {
        // Try to enable WebMidi if available
        if (typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator) {
          const { WebMidi } = await import('webmidi');
          await WebMidi.enable();
          this.midiEnabled = true;
          console.log('WebMidi enabled successfully');
        } else {
          console.log('MIDI not available in this environment');
        }
      } catch (midiError) {
        console.warn('MIDI initialization failed, continuing without MIDI:', midiError);
        this.midiEnabled = false;
      }
      
      this.initialized = true;
      console.log('Audio engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }
  
  isInitialized(): boolean {
    return this.initialized;
  }
  
  isMidiEnabled(): boolean {
    return this.midiEnabled;
  }
  
  getContext(): typeof Tone.context {
    return Tone.context;
  }
  
  async dispose(): Promise<void> {
    if (this.midiEnabled) {
      try {
        const { WebMidi } = await import('webmidi');
        if (WebMidi.enabled) {
          WebMidi.disable();
        }
      } catch (error) {
        console.warn('Error disabling WebMidi:', error);
      }
    }
    
    try {
      Tone.Transport.stop();
    } catch (error) {
      console.warn('Error stopping Tone transport:', error);
    }
    
    this.initialized = false;
    this.midiEnabled = false;
  }
}
