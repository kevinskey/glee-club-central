
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

// Adds screen-edge protection to critical UI elements
export function addScreenEdgeProtection(element: HTMLElement, padding: number = 16): void {
  const observer = new ResizeObserver(() => {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check if element is too close to any edge and adjust
    if (rect.left < padding) {
      element.style.marginLeft = `${padding - rect.left}px`;
    }
    
    if (rect.right > viewportWidth - padding) {
      element.style.marginRight = `${rect.right - (viewportWidth - padding)}px`;
    }
    
    if (rect.top < padding) {
      element.style.marginTop = `${padding - rect.top}px`;
    }
    
    if (rect.bottom > viewportHeight - padding) {
      element.style.marginBottom = `${rect.bottom - (viewportHeight - padding)}px`;
    }
  });
  
  observer.observe(element);
  
  // Add touch listeners to help with edge avoidance for interactive elements
  element.addEventListener('touchstart', (e) => {
    const rect = element.getBoundingClientRect();
    const touch = e.touches[0];
    
    // If touch is near the edge of the element, add extra padding to help with touch accuracy
    const touchMargin = 10;
    if (touch.clientX - rect.left < touchMargin || 
        rect.right - touch.clientX < touchMargin ||
        touch.clientY - rect.top < touchMargin ||
        rect.bottom - touch.clientY < touchMargin) {
      element.style.padding = `${touchMargin}px`;
    }
  });
  
  // Clean up padding after touch
  element.addEventListener('touchend', () => {
    // Restore original padding after a short delay
    setTimeout(() => {
      element.style.padding = '';
    }, 300);
  });
}

// Optimize images for mobile network conditions
export function optimizeImageForMobile(imgElement: HTMLImageElement): void {
  // Set load priority for visible images
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        
        // Add loading priority
        image.setAttribute('loading', 'eager');
        
        // Use webp if supported
        if ('connection' in navigator && (navigator as any).connection?.effectiveType === '4g') {
          // Use high quality for fast connections
          if (image.src.endsWith('.jpg') || image.src.endsWith('.jpeg')) {
            const webpSrc = image.src.replace(/\.(jpg|jpeg)$/i, '.webp');
            // Try to load WebP version if it exists
            const testImg = new Image();
            testImg.onload = () => { image.src = webpSrc; };
            testImg.src = webpSrc;
          }
        } else {
          // Use lower quality for slower connections
          if (!image.src.includes('?quality=')) {
            image.src = `${image.src}?quality=80&width=${Math.round(image.width * 1.5)}`;
          }
        }
        
        observer.unobserve(image);
      }
    });
  }, { rootMargin: '200px' });
  
  observer.observe(imgElement);
}
