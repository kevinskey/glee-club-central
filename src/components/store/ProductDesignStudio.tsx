
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Wand2, Download, ShoppingCart, AlertCircle, Type } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BrandSelector } from './BrandSelector';
import { ColorSelector } from './ColorSelector';

const PRODUCT_TYPES = [
  { id: 't-shirt', name: 'T-Shirt', basePrice: 25.00 },
  { id: 'hoodie', name: 'Hoodie', basePrice: 45.00 },
  { id: 'tank-top', name: 'Tank Top', basePrice: 22.00 },
  { id: 'long-sleeve', name: 'Long Sleeve', basePrice: 30.00 },
];

const BRAND_PRICING = {
  gildan: 15.00,
  nextlevel: 22.00,
  comfortcolors: 28.00,
};

export function ProductDesignStudio() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string; code: string } | null>(null);
  const [designName, setDesignName] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [designText, setDesignText] = useState('');
  const [designMode, setDesignMode] = useState<'upload' | 'text' | null>(null);
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setSelectedFile(file);
      setError(null);
      toast.success('Image uploaded successfully');
    }
  };

  const generateMockup = async () => {
    if (!selectedProduct || !selectedBrand || !selectedColor) {
      toast.error('Please complete all selections: product type, brand, and color');
      return;
    }

    if (!selectedFile && !designText) {
      toast.error('Please either upload an image or enter text for your design');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Starting Amazon-style mockup generation process...');
      
      let userImageUrl = null;
      
      // Upload the user's graphic to Supabase storage if they uploaded a file
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `user-designs/${fileName}`;

        console.log('Uploading user design to storage...');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload design: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);
        
        userImageUrl = publicUrl;
      }

      console.log('Calling AI mockup generation...');
      
      // Generate AI mockup with enhanced Amazon-style parameters
      const { data, error } = await supabase.functions.invoke('generate-product-mockup', {
        body: {
          userImageUrl,
          designText: designText || null,
          productType: selectedProduct,
          designName,
          designDescription,
          brandInfo: {
            brand: selectedBrand,
            color: selectedColor
          },
          amazonStyle: true,
          singleMockup: true
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`AI generation failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate mockup');
      }

      setGeneratedMockup(data.mockupUrl);
      toast.success('Amazon-style mockup generated successfully!');
    } catch (error) {
      console.error('Error generating mockup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate mockup. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const createProduct = async () => {
    if (!generatedMockup || !selectedProduct || !designName || !selectedBrand || !selectedColor) {
      toast.error('Please complete the design process first');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const productType = PRODUCT_TYPES.find(p => p.id === selectedProduct);
      const brandPrice = BRAND_PRICING[selectedBrand as keyof typeof BRAND_PRICING];
      const totalPrice = (productType?.basePrice || 25.00) + brandPrice;
      
      const { error } = await supabase
        .from('store_items')
        .insert({
          name: `${designName} - ${selectedColor.name}`,
          description: `${designDescription || `Custom ${productType?.name} with your design`}\n\nBrand: ${selectedBrand}\nColor: ${selectedColor.name} (${selectedColor.code})`,
          price: totalPrice,
          image_url: generatedMockup,
          tags: ['custom', 'ai-generated', selectedProduct, selectedBrand, selectedColor.name.toLowerCase()],
          quantity_in_stock: 999,
          is_active: true
        });

      if (error) throw error;

      toast.success('Product created and added to store!');
      
      // Reset form
      setSelectedFile(null);
      setSelectedProduct('');
      setSelectedBrand('');
      setSelectedColor(null);
      setDesignName('');
      setDesignDescription('');
      setDesignText('');
      setDesignMode(null);
      setGeneratedMockup(null);
      setError(null);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedProduct || !selectedBrand) return 0;
    const productType = PRODUCT_TYPES.find(p => p.id === selectedProduct);
    const brandPrice = BRAND_PRICING[selectedBrand as keyof typeof BRAND_PRICING];
    return (productType?.basePrice || 25.00) + brandPrice;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Product Design Studio - Amazon Ready
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Generation Failed</h4>
                <p className="text-red-700 mt-1">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Make sure the OpenAI API key is configured in your Supabase project settings.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product-type">Step 1: Choose Product Type</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product to customize" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - Base ${product.basePrice.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Brand Selection */}
          {selectedProduct && (
            <div className="space-y-2">
              <Label>Step 2: Choose Quality Tier</Label>
              <BrandSelector 
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
              />
            </div>
          )}

          {/* Step 3: Color Selection */}
          {selectedBrand && (
            <div className="space-y-2">
              <Label>Step 3: Select Garment Color</Label>
              <ColorSelector
                selectedBrand={selectedBrand}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          )}

          {/* Step 4: Design Method Selection */}
          {selectedColor && !designMode && (
            <div className="space-y-3">
              <Label>Step 4: How would you like to add your design?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setDesignMode('upload')}
                >
                  <Upload className="h-6 w-6" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setDesignMode('text')}
                >
                  <Type className="h-6 w-6" />
                  Create Text Design
                </Button>
              </div>
            </div>
          )}

          {/* Design Upload Section */}
          {designMode === 'upload' && (
            <div className="space-y-2">
              <Label htmlFor="design-upload">Upload Your Design</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  id="design-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="design-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to upload your design (PNG, JPG, SVG)'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                </label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDesignMode(null);
                  setSelectedFile(null);
                }}
              >
                ← Choose different design method
              </Button>
            </div>
          )}

          {/* Text Design Section */}
          {designMode === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="design-text">Enter Your Text Design</Label>
              <Textarea
                id="design-text"
                value={designText}
                onChange={(e) => setDesignText(e.target.value)}
                placeholder="Enter the text you want on your product..."
                rows={3}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDesignMode(null);
                  setDesignText('');
                }}
              >
                ← Choose different design method
              </Button>
            </div>
          )}

          {/* Design Details */}
          {(selectedFile || designText) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="design-name">Product Name</Label>
                <Input
                  id="design-name"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="e.g., Spelman Glee Custom Tee"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="design-description">Description (Optional)</Label>
                <Textarea
                  id="design-description"
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                  placeholder="Describe your custom product..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Price Display */}
          {selectedProduct && selectedBrand && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg">Price Preview</h3>
              <p className="text-2xl font-bold text-glee-spelman">
                ${calculatePrice().toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Includes base product + {selectedBrand} tier pricing
              </p>
            </div>
          )}

          {/* Generate Button */}
          {(selectedFile || designText) && selectedProduct && selectedBrand && selectedColor && (
            <Button
              onClick={generateMockup}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Amazon-Style Mockup...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Amazon-Style Mockup
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Mockup Preview */}
      {generatedMockup && (
        <Card>
          <CardHeader>
            <CardTitle>Amazon-Style Product Mockup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square max-w-md mx-auto bg-white rounded-lg overflow-hidden border">
              <img
                src={generatedMockup}
                alt="Generated product mockup"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{designName}</h3>
              <p className="text-gray-600">
                {selectedBrand} • {selectedColor?.name} • {selectedProduct}
              </p>
              <p className="text-glee-spelman font-bold text-xl">
                ${calculatePrice().toFixed(2)}
              </p>
              {designDescription && (
                <p className="text-gray-600">{designDescription}</p>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Mockup
              </Button>
              <Button 
                onClick={createProduct}
                disabled={isCreatingProduct}
              >
                {isCreatingProduct ? (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Store
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
