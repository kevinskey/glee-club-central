
// Detect mobile devices
export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

// Enable long-press functionality for mobile devices
export function enableLongPress(element: HTMLElement, callback: () => void, duration: number = 800): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isPressed = false;

  const startPress = () => {
    isPressed = true;
    timer = setTimeout(() => {
      if (isPressed) {
        callback();
      }
    }, duration);
  };

  const cancelPress = () => {
    isPressed = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    startPress();
  };

  const handlePointerDown = (e: PointerEvent) => {
    // Only handle as touch for touch devices
    if (e.pointerType === 'touch') {
      startPress();
    }
  };

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', cancelPress);
  element.addEventListener('touchcancel', cancelPress);
  element.addEventListener('pointerdown', handlePointerDown);
  element.addEventListener('pointerup', cancelPress);
  element.addEventListener('pointercancel', cancelPress);

  // Return a cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', cancelPress);
    element.removeEventListener('touchcancel', cancelPress);
    element.removeEventListener('pointerdown', handlePointerDown);
    element.removeEventListener('pointerup', cancelPress);
    element.removeEventListener('pointercancel', cancelPress);
  };
}

// Detects if the device supports haptic feedback
export function supportsHapticFeedback(): boolean {
  return 'vibrate' in navigator;
}

// Provides haptic feedback if supported
export function hapticFeedback(pattern: number | number[] = 50): void {
  if (supportsHapticFeedback()) {
    navigator.vibrate(pattern);
  }
}
