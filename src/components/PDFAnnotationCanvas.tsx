import React, { useRef, useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: string;
  type: "pen" | "eraser" | "square" | null;
  points: Point[];
  color: string;
  size: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface PDFAnnotationCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeTool: "pen" | "eraser" | "square" | null;
  canvasWidth: number;
  canvasHeight: number;
  penColor: string;
  penSize: number;
  scale: number;
  annotations: Annotation[];
  onChange: (annotations: Annotation[]) => void;
}

export const PDFAnnotationCanvas = ({
  containerRef,
  activeTool,
  canvasWidth,
  canvasHeight,
  penColor,
  penSize,
  scale,
  annotations,
  onChange,
}: PDFAnnotationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);

  // Render the annotations when they change or the canvas changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all annotations
    annotations.forEach((annotation) => {
      if (annotation.type === "pen" && annotation.points.length) {
        ctx.beginPath();
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        const firstPoint = annotation.points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        
        annotation.points.slice(1).forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        
        ctx.stroke();
      } else if (annotation.type === "square" && annotation.x !== undefined && 
                annotation.y !== undefined && annotation.width !== undefined && 
                annotation.height !== undefined) {
        ctx.beginPath();
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.size;
        ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
        ctx.stroke();
      }
    });
  }, [annotations, canvasWidth, canvasHeight]);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasCoordinates = (event: MouseEvent | TouchEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    };

    const handleStart = (event: MouseEvent | TouchEvent) => {
      if (!activeTool) return;

      const point = getCanvasCoordinates(event);
      setIsDrawing(true);

      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: activeTool,
        points: [point],
        color: penColor,
        size: penSize,
      };

      if (activeTool === "square") {
        newAnnotation.x = point.x;
        newAnnotation.y = point.y;
        newAnnotation.width = 0;
        newAnnotation.height = 0;
      }

      setCurrentAnnotation(newAnnotation);
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing || !currentAnnotation) return;

      const point = getCanvasCoordinates(event);

      if (currentAnnotation.type === "pen") {
        setCurrentAnnotation({
          ...currentAnnotation,
          points: [...currentAnnotation.points, point],
        });
      } else if (currentAnnotation.type === "square" && 
                currentAnnotation.x !== undefined && 
                currentAnnotation.y !== undefined) {
        setCurrentAnnotation({
          ...currentAnnotation,
          width: point.x - currentAnnotation.x,
          height: point.y - currentAnnotation.y,
        });
      }
    };

    const handleEnd = () => {
      if (!isDrawing || !currentAnnotation) return;

      if (currentAnnotation.type === "eraser") {
        // For eraser, filter out annotations that intersect with the eraser path
        onChange(annotations.filter(ann => {
          if (ann.type !== "pen") return true; // Only erase pen annotations for now
          
          // Simple intersection check - any point from current path near any point from the annotation
          return !ann.points.some(annPoint => 
            currentAnnotation.points.some(eraserPoint => 
              Math.sqrt(Math.pow(eraserPoint.x - annPoint.x, 2) + 
                        Math.pow(eraserPoint.y - annPoint.y, 2)) < (penSize + ann.size) / 2
            )
          );
        }));
      } else {
        // For drawing tools, add the new annotation
        onChange([...annotations, currentAnnotation]);
      }

      setIsDrawing(false);
      setCurrentAnnotation(null);
    };

    // Add event listeners
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("touchstart", handleStart);
    
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("touchstart", handleStart);
      
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [activeTool, isDrawing, currentAnnotation, annotations, onChange, penColor, penSize, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute top-0 left-0 pointer-events-auto z-10"
      style={{ 
        touchAction: activeTool ? "none" : "auto",
      }}
    />
  );
};
