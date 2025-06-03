
import React, { useRef, useState, useCallback } from 'react';
import { TextElement } from '@/types/slideDesign';

interface TouchGestureHandlerProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
  onSelect: () => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface TouchState {
  touches: { [key: number]: { x: number; y: number; startTime: number } };
  initialDistance: number;
  initialScale: number;
  initialRotation: number;
  lastTap: number;
}

export function TouchGestureHandler({
  element,
  onUpdate,
  onSelect,
  children,
  containerRef
}: TouchGestureHandlerProps) {
  const touchState = useRef<TouchState>({
    touches: {},
    initialDistance: 0,
    initialScale: 1,
    initialRotation: 0,
    lastTap: 0
  });

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onSelect();

    const touches = Array.from(e.touches);
    const now = Date.now();

    // Handle double tap
    if (touches.length === 1) {
      const timeSinceLastTap = now - touchState.current.lastTap;
      if (timeSinceLastTap < 300) {
        // Double tap detected - could trigger edit mode
        console.log('Double tap detected');
      }
      touchState.current.lastTap = now;
    }

    // Store touch positions
    touches.forEach((touch, index) => {
      touchState.current.touches[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        startTime: now
      };
    });

    // Multi-touch gestures
    if (touches.length === 2) {
      touchState.current.initialDistance = getDistance(touches[0], touches[1]);
      touchState.current.initialScale = scale;
      touchState.current.initialRotation = getAngle(touches[0], touches[1]);
    }
  }, [onSelect, scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;

    const touches = Array.from(e.touches);
    const container = containerRef.current;

    if (touches.length === 1) {
      // Single touch - move element
      const touch = touches[0];
      const startTouch = touchState.current.touches[touch.identifier];
      
      if (startTouch) {
        const newX = ((touch.clientX - container.offsetLeft) / container.offsetWidth) * 100;
        const newY = ((touch.clientY - container.offsetTop) / container.offsetHeight) * 100;

        // Constrain to container bounds
        const constrainedX = Math.max(0, Math.min(100, newX));
        const constrainedY = Math.max(0, Math.min(100, newY));

        onUpdate({
          position: { x: constrainedX, y: constrainedY }
        });
      }
    } else if (touches.length === 2) {
      // Two finger gestures - pinch to zoom and rotate
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentAngle = getAngle(touches[0], touches[1]);
      
      // Calculate scale change
      const scaleChange = currentDistance / touchState.current.initialDistance;
      const newScale = Math.max(0.5, Math.min(3, touchState.current.initialScale * scaleChange));
      
      // Calculate rotation change
      const rotationChange = currentAngle - touchState.current.initialRotation;
      const newRotation = (rotation + rotationChange) % 360;
      
      setScale(newScale);
      setRotation(newRotation);
      
      // Update font size based on scale
      const currentFontSize = parseFloat(element.style.fontSize || '1rem');
      const newFontSize = `${Math.max(0.5, Math.min(5, currentFontSize * (newScale / scale)))}rem`;
      
      onUpdate({
        style: {
          ...element.style,
          fontSize: newFontSize
        }
      });
    }
  }, [element, onUpdate, containerRef, scale, rotation]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clean up touch tracking
    Array.from(e.changedTouches).forEach(touch => {
      delete touchState.current.touches[touch.identifier];
    });

    // Reset gesture state if no more touches
    if (Object.keys(touchState.current.touches).length === 0) {
      touchState.current.initialDistance = 0;
      touchState.current.initialScale = scale;
      touchState.current.initialRotation = 0;
    }
  }, [scale]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
}
