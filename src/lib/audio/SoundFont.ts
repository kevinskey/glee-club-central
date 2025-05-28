
import Soundfont from 'soundfont-player';

export interface SoundFontInstrument {
  name: string;
  id: string;
  category: string;
}

export const AVAILABLE_INSTRUMENTS: SoundFontInstrument[] = [
  // Piano Family
  { name: 'Acoustic Grand Piano', id: 'acoustic_grand_piano', category: 'Piano' },
  { name: 'Bright Acoustic Piano', id: 'bright_acoustic_piano', category: 'Piano' },
  { name: 'Electric Grand Piano', id: 'electric_grand_piano', category: 'Piano' },
  { name: 'Honky-tonk Piano', id: 'honkytonk_piano', category: 'Piano' },
  { name: 'Electric Piano 1', id: 'electric_piano_1', category: 'Piano' },
  { name: 'Electric Piano 2', id: 'electric_piano_2', category: 'Piano' },
  { name: 'Harpsichord', id: 'harpsichord', category: 'Piano' },
  { name: 'Clavinet', id: 'clavinet', category: 'Piano' },
  
  // Chromatic Percussion
  { name: 'Celesta', id: 'celesta', category: 'Chromatic Percussion' },
  { name: 'Glockenspiel', id: 'glockenspiel', category: 'Chromatic Percussion' },
  { name: 'Music Box', id: 'music_box', category: 'Chromatic Percussion' },
  { name: 'Vibraphone', id: 'vibraphone', category: 'Chromatic Percussion' },
  { name: 'Marimba', id: 'marimba', category: 'Chromatic Percussion' },
  { name: 'Xylophone', id: 'xylophone', category: 'Chromatic Percussion' },
  { name: 'Tubular Bells', id: 'tubular_bells', category: 'Chromatic Percussion' },
  { name: 'Dulcimer', id: 'dulcimer', category: 'Chromatic Percussion' },
  
  // Organ
  { name: 'Drawbar Organ', id: 'drawbar_organ', category: 'Organ' },
  { name: 'Percussive Organ', id: 'percussive_organ', category: 'Organ' },
  { name: 'Rock Organ', id: 'rock_organ', category: 'Organ' },
  { name: 'Church Organ', id: 'church_organ', category: 'Organ' },
  { name: 'Reed Organ', id: 'reed_organ', category: 'Organ' },
  { name: 'Accordion', id: 'accordion', category: 'Organ' },
  { name: 'Harmonica', id: 'harmonica', category: 'Organ' },
  { name: 'Tango Accordion', id: 'tango_accordion', category: 'Organ' },
  
  // Guitar
  { name: 'Acoustic Guitar (nylon)', id: 'acoustic_guitar_nylon', category: 'Guitar' },
  { name: 'Acoustic Guitar (steel)', id: 'acoustic_guitar_steel', category: 'Guitar' },
  { name: 'Electric Guitar (jazz)', id: 'electric_guitar_jazz', category: 'Guitar' },
  { name: 'Electric Guitar (clean)', id: 'electric_guitar_clean', category: 'Guitar' },
  { name: 'Electric Guitar (muted)', id: 'electric_guitar_muted', category: 'Guitar' },
  { name: 'Overdriven Guitar', id: 'overdriven_guitar', category: 'Guitar' },
  { name: 'Distortion Guitar', id: 'distortion_guitar', category: 'Guitar' },
  { name: 'Guitar Harmonics', id: 'guitar_harmonics', category: 'Guitar' },
  
  // Bass
  { name: 'Acoustic Bass', id: 'acoustic_bass', category: 'Bass' },
  { name: 'Electric Bass (finger)', id: 'electric_bass_finger', category: 'Bass' },
  { name: 'Electric Bass (pick)', id: 'electric_bass_pick', category: 'Bass' },
  { name: 'Fretless Bass', id: 'fretless_bass', category: 'Bass' },
  { name: 'Slap Bass 1', id: 'slap_bass_1', category: 'Bass' },
  { name: 'Slap Bass 2', id: 'slap_bass_2', category: 'Bass' },
  { name: 'Synth Bass 1', id: 'synth_bass_1', category: 'Bass' },
  { name: 'Synth Bass 2', id: 'synth_bass_2', category: 'Bass' },
  
  // Strings
  { name: 'Violin', id: 'violin', category: 'Strings' },
  { name: 'Viola', id: 'viola', category: 'Strings' },
  { name: 'Cello', id: 'cello', category: 'Strings' },
  { name: 'Contrabass', id: 'contrabass', category: 'Strings' },
  { name: 'Tremolo Strings', id: 'tremolo_strings', category: 'Strings' },
  { name: 'Pizzicato Strings', id: 'pizzicato_strings', category: 'Strings' },
  { name: 'Orchestral Harp', id: 'orchestral_harp', category: 'Strings' },
  { name: 'Timpani', id: 'timpani', category: 'Strings' },
  
  // Ensemble
  { name: 'String Ensemble 1', id: 'string_ensemble_1', category: 'Ensemble' },
  { name: 'String Ensemble 2', id: 'string_ensemble_2', category: 'Ensemble' },
  { name: 'Synth Strings 1', id: 'synthstrings_1', category: 'Ensemble' },
  { name: 'Synth Strings 2', id: 'synthstrings_2', category: 'Ensemble' },
  { name: 'Choir Aahs', id: 'choir_aahs', category: 'Ensemble' },
  { name: 'Voice Oohs', id: 'voice_oohs', category: 'Ensemble' },
  { name: 'Synth Voice', id: 'synth_voice', category: 'Ensemble' },
  { name: 'Orchestra Hit', id: 'orchestra_hit', category: 'Ensemble' },
  
  // Brass
  { name: 'Trumpet', id: 'trumpet', category: 'Brass' },
  { name: 'Trombone', id: 'trombone', category: 'Brass' },
  { name: 'Tuba', id: 'tuba', category: 'Brass' },
  { name: 'Muted Trumpet', id: 'muted_trumpet', category: 'Brass' },
  { name: 'French Horn', id: 'french_horn', category: 'Brass' },
  { name: 'Brass Section', id: 'brass_section', category: 'Brass' },
  { name: 'Synth Brass 1', id: 'synthbrass_1', category: 'Brass' },
  { name: 'Synth Brass 2', id: 'synthbrass_2', category: 'Brass' },
  
  // Reed
  { name: 'Soprano Sax', id: 'soprano_sax', category: 'Reed' },
  { name: 'Alto Sax', id: 'alto_sax', category: 'Reed' },
  { name: 'Tenor Sax', id: 'tenor_sax', category: 'Reed' },
  { name: 'Baritone Sax', id: 'baritone_sax', category: 'Reed' },
  { name: 'Oboe', id: 'oboe', category: 'Reed' },
  { name: 'English Horn', id: 'english_horn', category: 'Reed' },
  { name: 'Bassoon', id: 'bassoon', category: 'Reed' },
  { name: 'Clarinet', id: 'clarinet', category: 'Reed' },
  
  // Pipe
  { name: 'Piccolo', id: 'piccolo', category: 'Pipe' },
  { name: 'Flute', id: 'flute', category: 'Pipe' },
  { name: 'Recorder', id: 'recorder', category: 'Pipe' },
  { name: 'Pan Flute', id: 'pan_flute', category: 'Pipe' },
  { name: 'Blown Bottle', id: 'blown_bottle', category: 'Pipe' },
  { name: 'Shakuhachi', id: 'shakuhachi', category: 'Pipe' },
  { name: 'Whistle', id: 'whistle', category: 'Pipe' },
  { name: 'Ocarina', id: 'ocarina', category: 'Pipe' },
  
  // Synth Lead
  { name: 'Lead 1 (square)', id: 'lead_1_square', category: 'Synth Lead' },
  { name: 'Lead 2 (sawtooth)', id: 'lead_2_sawtooth', category: 'Synth Lead' },
  { name: 'Lead 3 (calliope)', id: 'lead_3_calliope', category: 'Synth Lead' },
  { name: 'Lead 4 (chiff)', id: 'lead_4_chiff', category: 'Synth Lead' },
  { name: 'Lead 5 (charang)', id: 'lead_5_charang', category: 'Synth Lead' },
  { name: 'Lead 6 (voice)', id: 'lead_6_voice', category: 'Synth Lead' },
  { name: 'Lead 7 (fifths)', id: 'lead_7_fifths', category: 'Synth Lead' },
  { name: 'Lead 8 (bass + lead)', id: 'lead_8_bass__lead', category: 'Synth Lead' }
];

export class SoundFontManager {
  private instruments: Map<string, any> = new Map();
  private audioContext: AudioContext;
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }
  
  async loadInstrument(instrumentId: string): Promise<any> {
    if (this.instruments.has(instrumentId)) {
      return this.instruments.get(instrumentId);
    }
    
    try {
      const instrument = await Soundfont.instrument(this.audioContext, instrumentId);
      this.instruments.set(instrumentId, instrument);
      console.log(`Loaded instrument: ${instrumentId}`);
      return instrument;
    } catch (error) {
      console.error(`Failed to load instrument ${instrumentId}:`, error);
      throw error;
    }
  }
  
  getLoadedInstrument(instrumentId: string): any {
    return this.instruments.get(instrumentId);
  }
  
  isInstrumentLoaded(instrumentId: string): boolean {
    return this.instruments.has(instrumentId);
  }
  
  async preloadInstruments(instrumentIds: string[]): Promise<void> {
    const loadPromises = instrumentIds.map(id => this.loadInstrument(id));
    await Promise.all(loadPromises);
  }
  
  dispose(): void {
    this.instruments.forEach(instrument => {
      if (instrument && typeof instrument.stop === 'function') {
        instrument.stop();
      }
    });
    this.instruments.clear();
  }
}
