
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
      <div className="p-4 border rounded-lg bg-muted/50">
        <div className="text-center">
          <Type className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Select a text element to edit its properties
          </p>
          <Button onClick={onAddElement} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Text Element
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Text Properties</h4>
        <Button
          onClick={() => onDeleteElement(selectedElement.id)}
          size="sm"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="text-content">Text Content</Label>
          <Input
            id="text-content"
            value={selectedElement.text}
            onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
            placeholder="Enter your text"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <Select 
              value={selectedElement.style.fontSize} 
              onValueChange={(value) => handleStyleUpdate('fontSize', value)}
            >
              <SelectTrigger id="font-size">
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

          <div>
            <Label htmlFor="font-weight">Font Weight</Label>
            <Select 
              value={selectedElement.style.fontWeight || 'normal'} 
              onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
            >
              <SelectTrigger id="font-weight">
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

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="text-color"
              type="color"
              value={selectedElement.style.color}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              value={selectedElement.style.color}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1"
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label>Text Alignment</Label>
          <div className="flex gap-1 mt-1">
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => setAlignment('left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => setAlignment('center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => setAlignment('right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Text Style</Label>
          <div className="flex gap-1 mt-1">
            <Button
              size="sm"
              variant={selectedElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={toggleBold}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <Button onClick={onAddElement} size="sm" variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Text Element
        </Button>
      </div>
    </div>
  );
}
