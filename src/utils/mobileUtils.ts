import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Custom hook that returns optimized event handlers for both touch and mouse
 * Useful for interactive elements that need to work on both mobile and desktop
 */
export const useUnifiedInteractionHandlers = () => {
  const isMobile = useIsMobile();

  const onPointerDown = (mouseHandler: (e: MouseEvent) => void, touchHandler: (e: TouchEvent) => void) => {
    return (e: React.PointerEvent) => {
      if (isMobile && e.pointerType === 'touch') {
        touchHandler(e.nativeEvent as TouchEvent);
      } else {
        mouseHandler(e.nativeEvent as MouseEvent);
      }
    };
  };

  const onClick = (mouseHandler: (e: MouseEvent) => void, touchHandler: (e: TouchEvent) => void) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      if (isMobile && e.type === 'touchstart') {
        touchHandler(e.nativeEvent as TouchEvent);
      } else {
        mouseHandler(e.nativeEvent as MouseEvent);
      }
    };
  };

  return {
    onPointerDown,
    onClick,
    isMobile
  };
};

/**
 * Adds mouse event handlers to an element
 * @param element HTML Element to attach handlers to
 * @param eventListeners Object containing event listeners to add
 */
export const addMouseHandlers = (element: HTMLElement, eventListeners: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(eventListeners).forEach(([event, listener]) => {
    element.addEventListener(event, listener);
  });
};

/**
 * Removes mouse event handlers from an element
 * @param element HTML Element to remove handlers from
 * @param eventListeners Object containing event listeners to remove
 */
export const removeMouseHandlers = (element: HTMLElement, eventListeners: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(eventListeners).forEach(([event, listener]) => {
    element.removeEventListener(event, listener);
  });
};

/**
 * Adds touch event handlers that mimic mouse events
 * @param element HTML Element to attach handlers to
 * @returns Object containing touch handlers that were added
 */
export const addTouchHandlers = (element: HTMLElement) => {
  const touchEvents: Record<string, EventListener> = {};
  
  if (!element) return touchEvents;
  
  // Convert mouse event to touch event
  const mapTouch = (mouseHandler: (e: MouseEvent) => void) => {
    return (e: TouchEvent) => {
      // Prevent default to avoid double events
      e.preventDefault();
      
      // Create a synthetic mouse event from touch data
      const touch = e.touches[0] || e.changedTouches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: touch.clientX,
        clientY: touch.clientY,
        screenX: touch.screenX,
        screenY: touch.screenY
      });
      
      // Call the original mouse handler with our synthetic event
      mouseHandler(mouseEvent);
    };
  };
  
  // We can't access event listeners directly in standard DOM
  // Instead, let's just add touch handlers for common interactions
  const addCommonTouchHandlers = () => {
    // For elements that might have click handlers
    if (element.onclick) {
      const touchHandler = (e: TouchEvent) => {
        e.preventDefault();
        element.click();
      };
      element.addEventListener('touchend', touchHandler);
      touchEvents.touchend = touchHandler;
    }
  };
  
  addCommonTouchHandlers();
  return touchEvents;
};

/**
 * Removes touch event handlers from an element
 * @param element HTML Element to remove handlers from
 * @param touchEvents Object containing touch event listeners to remove
 */
export const removeTouchHandlers = (element: HTMLElement, touchEvents: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(touchEvents).forEach(([event, listener]) => {
    element.removeEventListener(event, listener);
  });
};
