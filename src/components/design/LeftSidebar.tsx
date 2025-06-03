import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Type, Image, Palette, Users, Wand2, FolderOpen, Package } from 'lucide-react';
import { useDesign } from './DesignContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useDesignAssets } from '@/hooks/useDesignAssets';

const FONTS = ['Montserrat', 'Courier', 'Poppins', 'Playfair Display', 'Anton'];
const COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const CLIPART_OPTIONS = ['Star', 'Heart', 'Arrow', 'Circle', 'Square', 'Triangle'];

const PRODUCT_TYPES = [
  { id: 't-shirt', name: 'T-Shirt', icon: '👕' },
  { id: 'hoodie', name: 'Hoodie', icon: '🧥' },
  { id: 'tank-top', name: 'Tank Top', icon: '👔' },
  { id: 'long-sleeve', name: 'Long Sleeve', icon: '👕' },
  { id: 'tote-bag', name: 'Tote Bag', icon: '👜' },
  { id: 'mug', name: 'Mug', icon: '☕' }
];

export const LeftSidebar = () => {
  const { addElement, currentView } = useDesign();
  const { completedAssets, getAssetUrl } = useDesignAssets();
  const [activeTab, setActiveTab] = useState('start');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFont, setSelectedFont] = useState('Montserrat');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    toast.success(`${PRODUCT_TYPES.find(p => p.id === productId)?.name} selected as design base`);
  };

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

  const handleAssetSelect = async (asset: any, extractedFile: any) => {
    try {
      const baseUrl = await getAssetUrl(asset.file_path);
      const imageUrl = `${baseUrl}/${extractedFile.path}`;
      
      addElement({
        type: 'image',
        content: imageUrl,
        x: 150,
        y: 150,
        width: 200,
        height: 200,
        placement: currentView
      });
      
      toast.success('Asset added to design');
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset to design');
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

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for what you want to create');
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      console.log('Generating design with AI prompt:', aiPrompt);
      
      const { data, error } = await supabase.functions.invoke('generate-design-image', {
        body: { 
          prompt: `Create a design for apparel/merchandise: ${aiPrompt}. Make it suitable for printing on clothing with clear, bold graphics.`,
          style: 'design'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.imageUrl) {
        // Add the generated image as an element
        addElement({
          type: 'image',
          content: data.imageUrl,
          x: 150,
          y: 150,
          width: 200,
          height: 200,
          placement: currentView
        });
        
        toast.success('AI design generated successfully!');
        setAiPrompt('');
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate design: ${error.message}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const tabs = [
    { id: 'start', label: 'Start Design', icon: Package },
    { id: 'assets', label: 'My Assets', icon: FolderOpen },
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
        {activeTab === 'start' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Design Starting Point</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">1. Select Product Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_TYPES.map(product => (
                    <Card
                      key={product.id}
                      className={`p-3 cursor-pointer transition-all hover:bg-gray-600 ${
                        selectedProduct === product.id 
                          ? 'bg-gray-600 border-orange-500 border-2' 
                          : 'bg-gray-700 border-gray-600'
                      }`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{product.icon}</div>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedProduct && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">2. Choose Design Source</Label>
                  
                  <Card className="p-4 bg-gray-700 border-gray-600">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Use My Assets
                    </h4>
                    {completedAssets.length === 0 ? (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-sm">No assets available</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab('assets')}
                          className="mt-2"
                        >
                          Upload Assets
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {completedAssets.slice(0, 3).map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => setActiveTab('assets')}
                            className="w-full p-2 text-left bg-gray-600 hover:bg-gray-500 rounded transition-colors text-white text-sm"
                          >
                            📁 {asset.file_name}
                          </button>
                        ))}
                        {completedAssets.length > 3 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('assets')}
                            className="w-full text-orange-400 hover:text-orange-300"
                          >
                            View all {completedAssets.length} assets →
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>

                  <Card className="p-4 bg-gray-700 border-gray-600">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload New Image
                    </h4>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="quick-upload"
                    />
                    <label
                      htmlFor="quick-upload"
                      className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Choose File
                    </label>
                  </Card>

                  <Card className="p-4 bg-gray-700 border-gray-600">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Create Text Design
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('text')}
                      className="w-full"
                    >
                      Add Text
                    </Button>
                  </Card>

                  <Card className="p-4 bg-gray-700 border-gray-600">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Generate with AI
                    </h4>
                    <Textarea
                      placeholder="Describe what you want to create..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white text-sm mb-2"
                      rows={2}
                    />
                    <Button
                      size="sm"
                      onClick={handleGenerateWithAI}
                      disabled={isGeneratingAI || !aiPrompt.trim()}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {isGeneratingAI ? 'Generating...' : 'Generate'}
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Design Assets</h3>
            
            {completedAssets.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-2" />
                <p>No extracted assets available</p>
                <p className="text-sm">Upload and extract assets to use them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedAssets.map((asset) => (
                  <Card key={asset.id} className="p-3 bg-gray-700 border-gray-600">
                    <h4 className="font-medium mb-2 text-white">{asset.file_name}</h4>
                    <div className="space-y-2">
                      {asset.extracted_files.map((file: any, index: number) => {
                        // Only show image files
                        if (!file.type?.startsWith('image/')) return null;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleAssetSelect(asset, file)}
                            className="w-full p-2 text-left bg-gray-600 hover:bg-gray-500 rounded transition-colors text-white text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

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
                placeholder="Describe what you want to create (e.g., 'a minimalist glee club logo with musical notes')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleGenerateWithAI}
                disabled={isGeneratingAI || !aiPrompt.trim()}
              >
                {isGeneratingAI ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
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
