
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Move } from 'lucide-react';

interface TextElement {
  id: string;
  type: 'title' | 'description';
  content: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
}

interface HeroTextPositionEditorProps {
  slideId: string;
  title: string;
  description: string;
  onUpdate: (updates: { title?: string; description?: string; textElements?: TextElement[] }) => void;
}

export function HeroTextPositionEditor({ 
  slideId, 
  title, 
  description, 
  onUpdate 
}: HeroTextPositionEditorProps) {
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 'title',
      type: 'title',
      content: title,
      position: { x: 50, y: 40 },
      style: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
      }
    },
    {
      id: 'description',
      type: 'description',
      content: description,
      position: { x: 50, y: 60 },
      style: {
        fontSize: '1.25rem',
        fontWeight: 'normal',
        color: '#ffffff',
        textAlign: 'center'
      }
    }
  ]);

  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(textElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTextElements(items);
    onUpdate({ textElements: items });
  };

  const handlePositionChange = (elementId: string, position: { x: number; y: number }) => {
    const updatedElements = textElements.map(element =>
      element.id === elementId ? { ...element, position } : element
    );
    setTextElements(updatedElements);
    onUpdate({ textElements: updatedElements });
  };

  const handleContentChange = (elementId: string, content: string) => {
    const updatedElements = textElements.map(element =>
      element.id === elementId ? { ...element, content } : element
    );
    setTextElements(updatedElements);
    
    // Also update the main title/description
    const element = updatedElements.find(el => el.id === elementId);
    if (element?.type === 'title') {
      onUpdate({ title: content, textElements: updatedElements });
    } else if (element?.type === 'description') {
      onUpdate({ description: content, textElements: updatedElements });
    }
  };

  const handleStyleChange = (elementId: string, styleKey: string, value: string) => {
    const updatedElements = textElements.map(element =>
      element.id === elementId 
        ? { ...element, style: { ...element.style, [styleKey]: value } }
        : element
    );
    setTextElements(updatedElements);
    onUpdate({ textElements: updatedElements });
  };

  const selectedElementData = textElements.find(el => el.id === selectedElement);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Text Element Positioning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Element List */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Text Elements</Label>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="text-elements">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {textElements.map((element, index) => (
                        <Draggable 
                          key={element.id} 
                          draggableId={element.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`cursor-pointer transition-colors ${
                                selectedElement === element.id 
                                  ? 'ring-2 ring-primary' 
                                  : ''
                              } ${
                                snapshot.isDragging ? 'opacity-50' : ''
                              }`}
                              onClick={() => setSelectedElement(element.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium capitalize">
                                      {element.type}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                      {element.content}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Position: {element.position.x}%, {element.position.y}%
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Element Editor */}
            {selectedElementData && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Edit {selectedElementData.type}
                </Label>
                
                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  {selectedElementData.type === 'title' ? (
                    <Input
                      id="content"
                      value={selectedElementData.content}
                      onChange={(e) => handleContentChange(selectedElementData.id, e.target.value)}
                      placeholder="Enter title"
                    />
                  ) : (
                    <Textarea
                      id="content"
                      value={selectedElementData.content}
                      onChange={(e) => handleContentChange(selectedElementData.id, e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                    />
                  )}
                </div>

                {/* Position */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="x-position">X Position (%)</Label>
                    <Input
                      id="x-position"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElementData.position.x}
                      onChange={(e) => handlePositionChange(
                        selectedElementData.id, 
                        { 
                          ...selectedElementData.position, 
                          x: parseInt(e.target.value) || 0 
                        }
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="y-position">Y Position (%)</Label>
                    <Input
                      id="y-position"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElementData.position.y}
                      onChange={(e) => handlePositionChange(
                        selectedElementData.id, 
                        { 
                          ...selectedElementData.position, 
                          y: parseInt(e.target.value) || 0 
                        }
                      )}
                    />
                  </div>
                </div>

                {/* Style Options */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input
                      id="font-size"
                      value={selectedElementData.style.fontSize}
                      onChange={(e) => handleStyleChange(selectedElementData.id, 'fontSize', e.target.value)}
                      placeholder="e.g., 2rem, 24px"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={selectedElementData.style.color}
                      onChange={(e) => handleStyleChange(selectedElementData.id, 'color', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-align">Text Alignment</Label>
                    <select
                      id="text-align"
                      value={selectedElementData.style.textAlign}
                      onChange={(e) => handleStyleChange(selectedElementData.id, 'textAlign', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '300px' }}>
            {textElements.map((element) => (
              <div
                key={element.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  color: element.style.color,
                  textAlign: element.style.textAlign,
                  maxWidth: '80%',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.content}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
