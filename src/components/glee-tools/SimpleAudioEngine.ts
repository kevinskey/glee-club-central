
export class SimpleAudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  playTone(frequency: number, duration: number = 1, volume: number = 0.5): void {
    if (!this.audioContext) return;

    try {
      // Create oscillator and gain node
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Configure gain (volume) with envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      // Connect and start
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);

      // Store references for cleanup
      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);

      // Auto cleanup
      setTimeout(() => {
        this.cleanup(oscillator, gainNode);
      }, (duration + 0.1) * 1000);

    } catch (error) {
      console.error('Error playing tone:', error);
    }
  }

  stopAll(): void {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });

    this.gainNodes.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Gain might already be disconnected
      }
    });

    this.oscillators = [];
    this.gainNodes = [];
  }

  private cleanup(oscillator: OscillatorNode, gainNode: GainNode): void {
    const oscIndex = this.oscillators.indexOf(oscillator);
    if (oscIndex !== -1) {
      this.oscillators.splice(oscIndex, 1);
    }

    const gainIndex = this.gainNodes.indexOf(gainNode);
    if (gainIndex !== -1) {
      this.gainNodes.splice(gainIndex, 1);
    }
  }

  dispose(): void {
    this.stopAll();
    this.audioContext = null;
  }
}
