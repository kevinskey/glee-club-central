
// Function to check if web audio is supported
export function isWebAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
}

// Function to create an audio context with fallback
export function createAudioContext(): AudioContext | null {
  if (!isWebAudioSupported()) {
    console.error('Web Audio API is not supported in this browser');
    return null;
  }
  
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioCtx();
  } catch (error) {
    console.error('Failed to create audio context:', error);
    return null;
  }
}

// Function to register keyboard shortcuts
export function registerKeyboardShortcut(key: string, callback: () => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only trigger if not typing in an input, textarea, or contentEditable element
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.getAttribute('contenteditable') === 'true';
    
    if (!isTyping && event.key.toLowerCase() === key.toLowerCase()) {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

// Create an oscillator for pitch pipe
export function createOscillator(
  audioContext: AudioContext,
  frequency: number,
  type: OscillatorType = 'sine'
): [OscillatorNode, GainNode] {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  return [oscillator, gainNode];
}

// Play a tone with envelope
export function playTone(
  audioContext: AudioContext,
  frequency: number,
  duration: number = 1,
  volume: number = 0.5,
  type: OscillatorType = 'sine'
): void {
  const [oscillator, gainNode] = createOscillator(audioContext, frequency, type);
  
  // Apply volume
  gainNode.gain.value = 0;
  
  // Attack
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02);
  
  // Decay and sustain
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime + duration - 0.05);
  
  // Release
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
  
  // Start and stop the oscillator
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}
