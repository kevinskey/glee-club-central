
import * as Tone from 'tone';
import { WebMidi, Input, Output } from 'webmidi';

export class AudioEngine {
  private static instance: AudioEngine;
  private initialized = false;
  private midiInputs: Input[] = [];
  private midiOutputs: Output[] = [];
  
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
      // Initialize Tone.js
      await Tone.start();
      console.log('Tone.js initialized successfully');
      
      // Initialize WebMidi
      await WebMidi.enable();
      console.log('WebMidi enabled successfully');
      
      // Get available MIDI devices
      this.midiInputs = WebMidi.inputs;
      this.midiOutputs = WebMidi.outputs;
      
      console.log('MIDI Inputs:', this.midiInputs.map(input => input.name));
      console.log('MIDI Outputs:', this.midiOutputs.map(output => output.name));
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }
  
  isInitialized(): boolean {
    return this.initialized;
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
    if (WebMidi.enabled) {
      WebMidi.disable();
    }
    await Tone.Transport.stop();
    this.initialized = false;
  }
}
