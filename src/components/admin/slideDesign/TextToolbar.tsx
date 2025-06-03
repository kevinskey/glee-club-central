
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TextElement } from '@/types/slideDesign';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Palette,
  Plus,
  Trash2
} from 'lucide-react';

interface TextToolbarProps {
  selectedElement: TextElement | null;
  onUpdateElement: (id: string, updates: Partial<TextElement>) => void;
  onAddElement: () => void;
  onDeleteElement: (id: string) => void;
}

export function TextToolbar({ 
  selectedElement, 
  onUpdateElement, 
  onAddElement, 
  onDeleteElement 
}: TextToolbarProps) {
  const fontSizes = [
    { value: '0.75rem', label: 'Small' },
    { value: '1rem', label: 'Medium' },
    { value: '1.25rem', label: 'Large' },
    { value: '1.5rem', label: 'X-Large' },
    { value: '2rem', label: 'XX-Large' },
    { value: '2.5rem', label: 'Huge' },
    { value: '3rem', label: 'Massive' }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'semibold', label: 'Semi Bold' },
    { value: 'bold', label: 'Bold' },
    { value: 'extrabold', label: 'Extra Bold' }
  ];

  const handleStyleUpdate = (property: string, value: any) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: value
      }
    });
  };

  const toggleBold = () => {
    const currentWeight = selectedElement?.style.fontWeight || 'normal';
    const newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
    handleStyleUpdate('fontWeight', newWeight);
  };

  const setAlignment = (alignment: 'left' | 'center' | 'right') => {
    handleStyleUpdate('textAlign', alignment);
  };

  if (!selectedElement) {
    return (
      <div className="p-3 border rounded-lg bg-muted/50">
        <div className="text-center">
          <Type className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground mb-2">
            Select a text element to edit its properties
          </p>
          <Button onClick={onAddElement} size="sm" className="h-7">
            <Plus className="h-3 w-3 mr-1" />
            Add Text Element
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Text Properties</h4>
        <Button
          onClick={() => onDeleteElement(selectedElement.id)}
          size="sm"
          variant="destructive"
          className="h-6"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="text-content" className="text-xs">Text Content</Label>
          <Input
            id="text-content"
            value={selectedElement.text}
            onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
            placeholder="Enter your text"
            className="h-7 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="font-size" className="text-xs">Font Size</Label>
            <Select 
              value={selectedElement.style.fontSize} 
              onValueChange={(value) => handleStyleUpdate('fontSize', value)}
            >
              <SelectTrigger id="font-size" className="h-7">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
            <Select 
              value={selectedElement.style.fontWeight || 'normal'} 
              onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
            >
              <SelectTrigger id="font-weight" className="h-7">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="text-color" className="text-xs">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="text-color"
              type="color"
              value={selectedElement.style.color}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
              className="w-12 h-7 p-1"
            />
            <Input
              value={selectedElement.style.color}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1 h-7 text-sm"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <Label className="text-xs">Text Alignment</Label>
          <div className="flex gap-1 mt-1">
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => setAlignment('left')}
              className="h-7 w-7 p-0"
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => setAlignment('center')}
              className="h-7 w-7 p-0"
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => setAlignment('right')}
              className="h-7 w-7 p-0"
            >
              <AlignRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Text Style</Label>
          <div className="flex gap-1 mt-1">
            <Button
              size="sm"
              variant={selectedElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={toggleBold}
              className="h-7 w-7 p-0"
            >
              <Bold className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        <Button onClick={onAddElement} size="sm" variant="outline" className="w-full h-7">
          <Plus className="h-3 w-3 mr-1" />
          Add New Text Element
        </Button>
      </div>
    </div>
  );
}
