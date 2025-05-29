
import { useEffect, useRef, useCallback } from 'react';

interface UsePDFMobileGesturesProps {
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pageNumber: number;
  numPages: number;
  scale: number;
}

export const usePDFMobileGestures = ({
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  pageNumber,
  numPages,
  scale
}: UsePDFMobileGesturesProps) => {
  const touchStartRef = useRef<{ x: number; y: number; distance?: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch for swipe gestures
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else if (e.touches.length === 2) {
      // Two finger touch for pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance
      };
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    if (e.changedTouches.length === 1 && !touchStartRef.current.distance) {
      // Handle swipe gesture
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      
      // Minimum swipe distance (50px)
      const minSwipeDistance = 50;
      
      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && pageNumber > 1) {
          // Swipe right - go to previous page
          onPrevPage();
        } else if (deltaX < 0 && pageNumber < numPages) {
          // Swipe left - go to next page
          onNextPage();
        }
      }
    }

    touchStartRef.current = null;
  }, [onPrevPage, onNextPage, pageNumber, numPages]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    if (e.touches.length === 2 && touchStartRef.current.distance) {
      // Handle pinch gesture
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const deltaDistance = currentDistance - touchStartRef.current.distance;
      const threshold = 20;
      
      if (Math.abs(deltaDistance) > threshold) {
        if (deltaDistance > 0 && scale < 3.0) {
          onZoomIn();
        } else if (deltaDistance < 0 && scale > 0.5) {
          onZoomOut();
        }
        
        // Update the reference distance to prevent continuous zooming
        touchStartRef.current.distance = currentDistance;
      }
    }
  }, [onZoomIn, onZoomOut, scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return { containerRef };
};
