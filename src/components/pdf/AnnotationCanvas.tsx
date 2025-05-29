import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
}

interface AnnotationData {
  type: 'pen' | 'highlighter' | 'text' | 'drawing';
  color: string;
  strokeWidth: number;
  points?: number[];
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  id: string; // Made required
}

interface AnnotationCanvasProps {
  width: number;
  height: number;
  currentTool: string;
  currentColor: string;
  strokeWidth: number;
  annotations: AnnotationData[];
  onAnnotationAdd: (annotation: AnnotationData) => void;
  onAnnotationRemove?: (annotationId: string) => void;
  showAnnotations: boolean;
  scale: number;
  className?: string;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  width,
  height,
  currentTool,
  currentColor,
  strokeWidth,
  annotations,
  onAnnotationAdd,
  onAnnotationRemove,
  showAnnotations,
  scale,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [textInput, setTextInput] = useState<{x: number, y: number, text: string} | null>(null);

  // Ensure all annotations have IDs
  const annotationsWithIds = annotations.map((annotation, index) => ({
    ...annotation,
    id: annotation.id || `annotation-${index}-${Date.now()}`
  }));

  // Function to check if a point is near a drawn path
  const isPointNearPath = (point: Point, pathPoints: number[], threshold: number = 20): boolean => {
    if (!pathPoints || pathPoints.length < 4) return false;
    
    for (let i = 0; i < pathPoints.length - 2; i += 2) {
      const pathX = pathPoints[i];
      const pathY = pathPoints[i + 1];
      const distance = Math.sqrt(Math.pow(point.x - pathX, 2) + Math.pow(point.y - pathY, 2));
      if (distance <= threshold) return true;
    }
    return false;
  };

  // Function to check if a point is near text annotation
  const isPointNearText = (point: Point, annotation: AnnotationData, threshold: number = 30): boolean => {
    if (!annotation.x || !annotation.y || !annotation.text) return false;
    
    // Estimate text bounds (rough approximation)
    const textWidth = annotation.text.length * (annotation.strokeWidth * 2);
    const textHeight = annotation.strokeWidth * 4;
    
    return (
      point.x >= annotation.x - threshold &&
      point.x <= annotation.x + textWidth + threshold &&
      point.y >= annotation.y - textHeight - threshold &&
      point.y <= annotation.y + threshold
    );
  };

  // Function to find annotation at point
  const findAnnotationAtPoint = (point: Point): AnnotationData | null => {
    // Check annotations in reverse order (top to bottom)
    for (let i = annotationsWithIds.length - 1; i >= 0; i--) {
      const annotation = annotationsWithIds[i];
      
      if (annotation.type === 'text') {
        if (isPointNearText(point, annotation)) return annotation;
      } else if (annotation.points) {
        if (isPointNearPath(point, annotation.points)) return annotation;
      }
    }
    return null;
  };

  // Redraw all annotations when they change
  useEffect(() => {
    if (!canvasRef.current || !showAnnotations) {
      // Clear canvas if annotations are hidden
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw all annotations
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    annotationsWithIds.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });
  }, [annotations, showAnnotations, scale]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: AnnotationData) => {
    ctx.save();
    
    switch (annotation.type) {
      case 'pen':
      case 'drawing':
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;
        
        if (annotation.points && annotation.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0], annotation.points[1]);
          for (let i = 2; i < annotation.points.length; i += 2) {
            ctx.lineTo(annotation.points[i], annotation.points[i + 1]);
          }
          ctx.stroke();
        }
        break;
        
      case 'highlighter':
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = Math.max(annotation.strokeWidth * 3, 12); // Make highlighter thicker
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.4; // Semi-transparent for highlighting effect
        ctx.globalCompositeOperation = 'multiply'; // Blend mode for highlighting
        
        if (annotation.points && annotation.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0], annotation.points[1]);
          for (let i = 2; i < annotation.points.length; i += 2) {
            ctx.lineTo(annotation.points[i], annotation.points[i + 1]);
          }
          ctx.stroke();
        }
        break;
        
      case 'text':
        ctx.fillStyle = annotation.color;
        ctx.font = `${annotation.strokeWidth * 3}px Arial`;
        ctx.globalAlpha = 1;
        if (annotation.text && annotation.x !== undefined && annotation.y !== undefined) {
          ctx.fillText(annotation.text, annotation.x, annotation.y);
        }
        break;
    }
    
    ctx.restore();
  };

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  const getTouchPos = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || e.touches.length === 0) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  const startDrawing = useCallback((point: Point) => {
    console.log('Starting drawing with tool:', currentTool);
    
    if (currentTool === 'eraser') {
      // Handle eraser tool
      const annotationToRemove = findAnnotationAtPoint(point);
      if (annotationToRemove && onAnnotationRemove) {
        console.log('Erasing annotation:', annotationToRemove.id);
        onAnnotationRemove(annotationToRemove.id);
      }
      return;
    }
    
    if (currentTool === 'text') {
      setTextInput({ x: point.x, y: point.y, text: '' });
      return;
    }
    
    if (currentTool === 'pen' || currentTool === 'highlighter') {
      setIsDrawing(true);
      setCurrentPath([point]);
      console.log('Drawing started, isDrawing set to true');
    }
  }, [currentTool, annotationsWithIds, onAnnotationRemove]);

  const continueDrawing = useCallback((point: Point) => {
    if (currentTool === 'eraser') {
      // Continue erasing while dragging
      const annotationToRemove = findAnnotationAtPoint(point);
      if (annotationToRemove && onAnnotationRemove) {
        console.log('Continuing to erase annotation:', annotationToRemove.id);
        onAnnotationRemove(annotationToRemove.id);
      }
      return;
    }

    if (!isDrawing || (currentTool !== 'pen' && currentTool !== 'highlighter')) return;
    
    const newPath = [...currentPath, point];
    setCurrentPath(newPath);
    
    // Draw current stroke on overlay canvas for immediate feedback
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext('2d');
      if (ctx && newPath.length > 1) {
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        ctx.save();
        
        if (currentTool === 'highlighter') {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = Math.max(strokeWidth * 3, 12);
          ctx.globalAlpha = 0.4;
          ctx.globalCompositeOperation = 'multiply';
        } else {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = strokeWidth;
          ctx.globalAlpha = 1;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(newPath[0].x, newPath[0].y);
        for (let i = 1; i < newPath.length; i++) {
          ctx.lineTo(newPath[i].x, newPath[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [isDrawing, currentPath, currentTool, currentColor, strokeWidth, annotationsWithIds, onAnnotationRemove]);

  const finishDrawing = useCallback(() => {
    console.log('Finishing drawing, isDrawing:', isDrawing, 'path length:', currentPath.length);
    
    if (currentTool === 'eraser') {
      // Nothing special to do for eraser on finish
      return;
    }
    
    if (!isDrawing || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath([]);
      
      // Clear overlay canvas
      const overlayCanvas = overlayCanvasRef.current;
      if (overlayCanvas) {
        const ctx = overlayCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }
      return;
    }
    
    // Convert path to flat array of coordinates
    const points: number[] = [];
    currentPath.forEach(point => {
      points.push(point.x, point.y);
    });
    
    const annotation: AnnotationData = {
      type: currentTool as 'pen' | 'highlighter',
      color: currentColor,
      strokeWidth,
      points,
      id: `annotation-${Date.now()}-${Math.random()}`
    };
    
    console.log('Adding annotation:', annotation);
    onAnnotationAdd(annotation);
    
    setIsDrawing(false);
    setCurrentPath([]);
    
    // Clear overlay canvas
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }
    }
  }, [isDrawing, currentPath, currentTool, currentColor, strokeWidth, onAnnotationAdd]);

  const handleTextSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInput && textInput.text.trim()) {
      const annotation: AnnotationData = {
        type: 'text',
        color: currentColor,
        strokeWidth,
        text: textInput.text,
        x: textInput.x,
        y: textInput.y,
        id: `text-${Date.now()}-${Math.random()}`
      };
      
      onAnnotationAdd(annotation);
      setTextInput(null);
    } else if (e.key === 'Escape') {
      setTextInput(null);
    }
  }, [textInput, currentColor, strokeWidth, onAnnotationAdd]);

  // Enhanced mouse events with better prevention
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const point = getMousePos(e);
    startDrawing(point);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const point = getMousePos(e);
    continueDrawing(point);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    finishDrawing();
  };

  // Enhanced touch events with scroll prevention
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent page scrolling when drawing
    e.preventDefault();
    e.stopPropagation();
    const point = getTouchPos(e);
    startDrawing(point);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Critical: prevent page scrolling during annotation
    e.preventDefault();
    e.stopPropagation();
    const point = getTouchPos(e);
    continueDrawing(point);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    finishDrawing();
  };

  // Determine cursor style based on current tool
  const getCursorStyle = () => {
    switch (currentTool) {
      case 'pen':
        return 'crosshair';
      case 'highlighter':
        return 'crosshair';
      case 'text':
        return 'text';
      case 'eraser':
        return 'grab';
      default:
        return 'default';
    }
  };

  return (
    <div className={cn("absolute inset-0", className)} style={{ pointerEvents: currentTool === 'none' ? 'none' : 'auto' }}>
      {/* Main annotation canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Overlay canvas for current drawing with enhanced touch handling */}
      <canvas
        ref={overlayCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ 
          cursor: getCursorStyle(),
          touchAction: currentTool !== 'none' ? 'none' : 'auto' // Prevent scrolling during annotation
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={finishDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
      />
      
      {/* Text input overlay */}
      {textInput && (
        <input
          type="text"
          value={textInput.text}
          onChange={(e) => setTextInput(prev => prev ? { ...prev, text: e.target.value } : null)}
          onKeyDown={handleTextSubmit}
          onBlur={() => setTextInput(null)}
          className="absolute bg-transparent border-none outline-none text-black"
          style={{
            left: textInput.x,
            top: textInput.y - 20,
            fontSize: `${strokeWidth * 3}px`,
            color: currentColor,
            zIndex: 10
          }}
          autoFocus
          placeholder="Type text..."
        />
      )}
    </div>
  );
};
