
/**
 * Utilities for mobile device detection and handling
 */

/**
 * Check if the current device is a mobile device based on user agent
 */
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

/**
 * Check if the current device has touch capabilities
 */
export const hasTouchCapability = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Convert a pointer event to touch coordinates safely
 * @param event The pointer or touch event
 * @returns Object with x and y coordinates
 */
export const getEventCoordinates = (event: MouseEvent | TouchEvent | PointerEvent): { x: number, y: number } => {
  if ('touches' in event && event.touches.length) {
    // It's a TouchEvent
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  } else if ('clientX' in event) {
    // It's a MouseEvent or PointerEvent
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  
  // Fallback
  return { x: 0, y: 0 };
};

/**
 * Detect the most appropriate swipe direction from a start and end point
 */
export const getSwipeDirection = (startX: number, startY: number, endX: number, endY: number): 'left' | 'right' | 'up' | 'down' | null => {
  const xDiff = startX - endX;
  const yDiff = startY - endY;
  
  // Check if the swipe was primarily horizontal or vertical
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    return xDiff > 0 ? 'left' : 'right';
  } else if (Math.abs(yDiff) > Math.abs(xDiff)) {
    return yDiff > 0 ? 'up' : 'down';
  }
  
  return null; // No significant direction detected
};

/**
 * Check if screen size matches mobile viewport
 */
export const isMobileViewport = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * Get device orientation: portrait or landscape
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Update CSS variables based on viewport and device characteristics
 */
export const updateCSSVariables = (): void => {
  const isMobile = isMobileViewport();
  const orientation = getOrientation();
  
  document.documentElement.style.setProperty('--is-mobile', isMobile ? '1' : '0');
  document.documentElement.style.setProperty('--orientation', orientation);
  document.documentElement.classList.toggle('is-mobile', isMobile);
  document.documentElement.classList.toggle('is-portrait', orientation === 'portrait');
  document.documentElement.classList.toggle('is-landscape', orientation === 'landscape');
};
