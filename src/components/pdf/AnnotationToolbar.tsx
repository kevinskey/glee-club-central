
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Type, 
  Highlighter, 
  Eraser,
  Undo,
  Redo,
  Save,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AnnotationToolbarProps {
  currentTool: string;
  onToolChange: (tool: string) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClear: () => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  className?: string;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
  '#800080', '#008000', '#800000', '#000080'
];

const strokeWidths = [1, 2, 3, 5, 8, 12];

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  currentTool,
  onToolChange,
  currentColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onClear,
  showAnnotations,
  onToggleAnnotations,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm", className)}>
      {/* Drawing Tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant={currentTool === 'pen' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('pen')}
          title="Pen"
        >
          <Palette className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'highlighter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('highlighter')}
          title="Highlighter"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('text')}
          title="Text"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'eraser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('eraser')}
          title="Eraser"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-1 border-r pr-2">
        <div className="grid grid-cols-6 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded border-2 transition-all",
                currentColor === color ? "border-gray-400 scale-110" : "border-gray-200"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={`Color: ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2 border-r pr-2">
        <span className="text-sm text-muted-foreground">Size:</span>
        <Select value={strokeWidth.toString()} onValueChange={(value) => onStrokeWidthChange(parseInt(value))}>
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {strokeWidths.map((width) => (
              <SelectItem key={width} value={width.toString()}>
                {width}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          title="Save annotations"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          title="Clear all annotations"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Visibility Toggle */}
      <Button
        variant={showAnnotations ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleAnnotations}
        title={showAnnotations ? 'Hide annotations' : 'Show annotations'}
      >
        {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
    </div>
  );
};
