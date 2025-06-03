
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Type, Image, Palette, Users } from 'lucide-react';
import { useDesign } from './DesignContext';

const FONTS = ['Montserrat', 'Courier', 'Poppins', 'Playfair Display', 'Anton'];
const COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const CLIPART_OPTIONS = ['Star', 'Heart', 'Arrow', 'Circle', 'Square', 'Triangle'];

export const LeftSidebar = () => {
  const { addElement, currentView } = useDesign();
  const [activeTab, setActiveTab] = useState('upload');
  const [textContent, setTextContent] = useState('');
  const [selectedFont, setSelectedFont] = useState('Montserrat');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addElement({
        type: 'image',
        content: url,
        x: 150,
        y: 150,
        width: 200,
        height: 200,
        placement: currentView
      });
    }
  };

  const handleAddText = () => {
    if (textContent.trim()) {
      addElement({
        type: 'text',
        content: textContent,
        x: 150,
        y: 150,
        fontSize,
        fontFamily: selectedFont,
        color: textColor,
        placement: currentView
      });
      setTextContent('');
    }
  };

  const handleAddClipart = (clipart: string) => {
    addElement({
      type: 'clipart',
      content: clipart,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      placement: currentView
    });
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'text', label: 'Add Text', icon: Type },
    { id: 'clipart', label: 'Add Clipart', icon: Image },
    { id: 'colors', label: 'Product Colors', icon: Palette },
    { id: 'names', label: 'Add Names', icon: Users }
  ];

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-600">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-700 transition-colors ${
                activeTab === tab.id ? 'bg-gray-700 border-r-2 border-orange-500' : ''
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4 h-full overflow-y-auto">
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How do you want to start?</h3>
            
            <Card className="p-4 bg-gray-700 border-gray-600">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-blue-400" />
                <h4 className="font-medium mb-2">Upload</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-blue-400 hover:text-blue-300"
                >
                  Choose File
                </label>
              </div>
            </Card>

            <div className="space-y-3">
              <Label htmlFor="ai-prompt">Generate with AI</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Describe what you want to create..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Generate with AI
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Text</h3>
            
            <div className="space-y-3">
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                placeholder="Enter your text..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="font-family">Font</Label>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map(font => (
                    <SelectItem key={font} value={font}>{font}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                id="font-size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                min="8"
                max="72"
              />
            </div>

            <div className="space-y-3">
              <Label>Text Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className={`w-8 h-8 rounded border-2 ${
                      textColor === color ? 'border-white' : 'border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleAddText} className="w-full bg-orange-600 hover:bg-orange-700">
              Add Text
            </Button>
          </div>
        )}

        {activeTab === 'clipart' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Clipart</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {CLIPART_OPTIONS.map(clipart => (
                <Card
                  key={clipart}
                  className="p-4 cursor-pointer hover:bg-gray-600 transition-colors bg-gray-700 border-gray-600"
                  onClick={() => handleAddClipart(clipart)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-xs">{clipart}</span>
                    </div>
                    <span className="text-sm">{clipart}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Colors</h3>
            <p className="text-sm text-gray-300">Select a color for your garment</p>
            
            <div className="grid grid-cols-4 gap-3">
              {['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'].map(color => (
                <button
                  key={color}
                  className="aspect-square rounded border-2 border-gray-600 hover:border-white transition-colors"
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                   color.toLowerCase() === 'black' ? '#000000' :
                                   color.toLowerCase()
                  }}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'names' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Names</h3>
            
            <div className="space-y-3">
              <Label htmlFor="custom-name">Custom Name</Label>
              <Input
                id="custom-name"
                placeholder="Enter custom name..."
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Add Name
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
