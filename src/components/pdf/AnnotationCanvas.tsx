
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
}

interface AnnotationCanvasProps {
  width: number;
  height: number;
  currentTool: string;
  currentColor: string;
  strokeWidth: number;
  annotations: AnnotationData[];
  onAnnotationAdd: (annotation: AnnotationData) => void;
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
  showAnnotations,
  scale,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [textInput, setTextInput] = useState<{x: number, y: number, text: string} | null>(null);

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
    
    annotations.forEach(annotation => {
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
    
    if (currentTool === 'text') {
      setTextInput({ x: point.x, y: point.y, text: '' });
      return;
    }
    
    if (currentTool === 'pen' || currentTool === 'highlighter') {
      setIsDrawing(true);
      setCurrentPath([point]);
      console.log('Drawing started, isDrawing set to true');
    }
  }, [currentTool]);

  const continueDrawing = useCallback((point: Point) => {
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
  }, [isDrawing, currentPath, currentTool, currentColor, strokeWidth]);

  const finishDrawing = useCallback(() => {
    console.log('Finishing drawing, isDrawing:', isDrawing, 'path length:', currentPath.length);
    
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
      points
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
        y: textInput.y
      };
      
      onAnnotationAdd(annotation);
      setTextInput(null);
    } else if (e.key === 'Escape') {
      setTextInput(null);
    }
  }, [textInput, currentColor, strokeWidth, onAnnotationAdd]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getMousePos(e);
    startDrawing(point);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getMousePos(e);
    continueDrawing(point);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    finishDrawing();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getTouchPos(e);
    startDrawing(point);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getTouchPos(e);
    continueDrawing(point);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
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
      
      {/* Overlay canvas for current drawing */}
      <canvas
        ref={overlayCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={finishDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
