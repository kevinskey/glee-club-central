
import React, { useState, useRef } from 'react';
import { TextElement } from '@/types/slideDesign';
import { MousePointer, Move, Settings } from 'lucide-react';

interface DraggableElementProps {
  element: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextElement>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  showBorders: boolean;
  borderStyle: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

export function DraggableElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  containerRef,
  showBorders,
  borderStyle
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (element.position.x * (containerRef.current?.offsetWidth || 1) / 100),
      y: e.clientY - (element.position.y * (containerRef.current?.offsetHeight || 1) / 100)
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const newX = ((e.clientX - dragStart.x) / container.offsetWidth) * 100;
    const newY = ((e.clientY - dragStart.y) / container.offsetHeight) * 100;

    // Constrain to container bounds
    const constrainedX = Math.max(0, Math.min(100, newX));
    const constrainedY = Math.max(0, Math.min(100, newY));

    onUpdate({
      position: { x: constrainedX, y: constrainedY }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    onUpdate({ text: e.currentTarget.textContent || '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const borderStyles = showBorders ? {
    border: `${borderStyle.width}px ${borderStyle.style} ${borderStyle.color}`,
  } : {};

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-pointer select-none transition-all group ${
        isSelected ? 'z-10' : 'z-0'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        transform: 'translate(-50%, -50%)',
        ...element.style,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: `clamp(0.75rem, ${element.style.fontSize || '1rem'}, 3rem)`,
        ...borderStyles,
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={() => setIsEditing(false)}
          onInput={handleTextChange}
          onKeyDown={handleKeyDown}
          className="outline-none bg-white/90 px-2 py-1 rounded"
          autoFocus
        >
          {element.text}
        </div>
      ) : (
        <span>{element.text}</span>
      )}
      
      {isSelected && (
        <>
          <MousePointer className="absolute -top-2 -right-2 h-4 w-4 text-blue-400" />
          <div className="absolute -top-6 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1">
              <Move className="h-3 w-3" />
              Drag
            </div>
            <div className="bg-green-500 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Double-click
            </div>
          </div>
        </>
      )}
    </div>
  );
}
