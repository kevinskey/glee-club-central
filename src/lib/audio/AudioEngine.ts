
import * as Tone from 'tone';
import { WebMidi, Input, Output } from 'webmidi';

export class AudioEngine {
  private static instance: AudioEngine;
  private initialized = false;
  private midiInputs: Input[] = [];
  private midiOutputs: Output[] = [];
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
      // Initialize Tone.js first - this is essential
      await Tone.start();
      console.log('Tone.js initialized successfully');
      
      // Try to initialize WebMidi, but don't fail if it's not available
      try {
        await WebMidi.enable();
        this.midiEnabled = true;
        this.midiInputs = WebMidi.inputs;
        this.midiOutputs = WebMidi.outputs;
        console.log('WebMidi enabled successfully');
        console.log('MIDI Inputs:', this.midiInputs.map(input => input.name));
        console.log('MIDI Outputs:', this.midiOutputs.map(output => output.name));
      } catch (midiError) {
        console.warn('MIDI not available in this environment:', midiError);
        this.midiEnabled = false;
        // Continue without MIDI - this is not a critical failure
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
  
  getMidiInputs(): Input[] {
    return this.midiInputs;
  }
  
  getMidiOutputs(): Output[] {
    return this.midiOutputs;
  }
  
  getContext(): typeof Tone.context {
    return Tone.context;
  }
  
  async dispose(): Promise<void> {
    if (this.midiEnabled && WebMidi.enabled) {
      try {
        WebMidi.disable();
      } catch (error) {
        console.warn('Error disabling WebMidi:', error);
      }
    }
    
    try {
      await Tone.Transport.stop();
    } catch (error) {
      console.warn('Error stopping Tone transport:', error);
    }
    
    this.initialized = false;
    this.midiEnabled = false;
  }
}
