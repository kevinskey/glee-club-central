
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
  Trash2,
  ChevronDown,
  MousePointer
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  { value: '#000000', name: 'Black' },
  { value: '#FF0000', name: 'Red' },
  { value: '#00FF00', name: 'Green' },
  { value: '#0000FF', name: 'Blue' },
  { value: '#FFFF00', name: 'Yellow' },
  { value: '#FF00FF', name: 'Magenta' },
  { value: '#00FFFF', name: 'Cyan' },
  { value: '#FFA500', name: 'Orange' },
  { value: '#800080', name: 'Purple' },
  { value: '#008000', name: 'Dark Green' },
  { value: '#800000', name: 'Maroon' },
  { value: '#000080', name: 'Navy' }
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
  const getCurrentColorName = () => {
    const color = colors.find(c => c.value === currentColor);
    return color?.name || 'Custom';
  };

  const handleToolSelect = (tool: string) => {
    console.log('Tool selected:', tool);
    onToolChange(tool);
  };

  const handleColorSelect = (color: string) => {
    console.log('Color selected:', color);
    onColorChange(color);
  };

  const handleStrokeWidthChange = (width: string) => {
    console.log('Stroke width changed:', width);
    onStrokeWidthChange(parseInt(width));
  };

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm overflow-x-auto", className)}>
      {/* Drawing Tools */}
      <div className="flex items-center gap-1 border-r pr-2 flex-shrink-0">
        <Button
          variant={currentTool === 'none' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToolSelect('none')}
          title="Select (Exit annotation mode)"
          className={cn(
            "transition-all",
            currentTool === 'none' && "bg-primary text-primary-foreground shadow-md"
          )}
        >
          <MousePointer className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'pen' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToolSelect('pen')}
          title="Pen"
          className={cn(
            "transition-all",
            currentTool === 'pen' && "bg-primary text-primary-foreground shadow-md"
          )}
        >
          <Palette className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'highlighter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToolSelect('highlighter')}
          title="Highlighter"
          className={cn(
            "transition-all",
            currentTool === 'highlighter' && "bg-yellow-500 text-yellow-900 shadow-md hover:bg-yellow-600"
          )}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToolSelect('text')}
          title="Text"
          className={cn(
            "transition-all",
            currentTool === 'text' && "bg-primary text-primary-foreground shadow-md"
          )}
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === 'eraser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleToolSelect('eraser')}
          title="Eraser"
          className={cn(
            "transition-all",
            currentTool === 'eraser' && "bg-primary text-primary-foreground shadow-md"
          )}
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {/* Color Picker Dropdown */}
      <div className="flex items-center gap-1 border-r pr-2 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
              <span className="hidden sm:inline text-xs">{getCurrentColorName()}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 p-2 bg-white dark:bg-gray-800 z-50" align="start">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    currentColor === color.value ? "border-gray-600 ring-2 ring-blue-500" : "border-gray-300"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorSelect(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2 border-r pr-2 flex-shrink-0">
        <span className="text-sm text-muted-foreground hidden sm:inline">Size:</span>
        <Select value={strokeWidth.toString()} onValueChange={handleStrokeWidthChange}>
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 z-50">
            {strokeWidths.map((width) => (
              <SelectItem key={width} value={width.toString()}>
                {width}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-r pr-2 flex-shrink-0">
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
      <div className="flex-shrink-0">
        <Button
          variant={showAnnotations ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleAnnotations}
          title={showAnnotations ? 'Hide annotations' : 'Show annotations'}
        >
          {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
