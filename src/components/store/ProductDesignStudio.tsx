
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Wand2, Download, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PRODUCT_TYPES = [
  { id: 't-shirt', name: 'T-Shirt', price: 25.00 },
  { id: 'hoodie', name: 'Hoodie', price: 45.00 },
  { id: 'mug', name: 'Mug', price: 15.00 },
  { id: 'tote-bag', name: 'Tote Bag', price: 20.00 },
  { id: 'phone-case', name: 'Phone Case', price: 18.00 },
  { id: 'sticker', name: 'Sticker Pack', price: 8.00 },
];

export function ProductDesignStudio() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [designName, setDesignName] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

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
      toast.success('Image uploaded successfully');
    }
  };

  const generateMockup = async () => {
    if (!selectedFile || !selectedProduct) {
      toast.error('Please upload an image and select a product type');
      return;
    }

    setIsGenerating(true);
    try {
      // Upload the user's graphic to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `user-designs/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      // Generate AI mockup using the uploaded image and selected product
      const { data, error } = await supabase.functions.invoke('generate-product-mockup', {
        body: {
          userImageUrl: publicUrl,
          productType: selectedProduct,
          designName,
          designDescription
        }
      });

      if (error) throw error;

      setGeneratedMockup(data.mockupUrl);
      toast.success('Mockup generated successfully!');
    } catch (error) {
      console.error('Error generating mockup:', error);
      toast.error('Failed to generate mockup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createProduct = async () => {
    if (!generatedMockup || !selectedProduct || !designName) {
      toast.error('Please complete the design process first');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const productType = PRODUCT_TYPES.find(p => p.id === selectedProduct);
      
      const { error } = await supabase
        .from('store_items')
        .insert({
          name: designName,
          description: designDescription || `Custom ${productType?.name} with your design`,
          price: productType?.price || 25.00,
          image_url: generatedMockup,
          tags: ['custom', 'ai-generated', selectedProduct],
          quantity_in_stock: 999, // Custom products are made on demand
          is_active: true
        });

      if (error) throw error;

      toast.success('Product created and added to store!');
      
      // Reset form
      setSelectedFile(null);
      setSelectedProduct('');
      setDesignName('');
      setDesignDescription('');
      setGeneratedMockup(null);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const selectedProductData = PRODUCT_TYPES.find(p => p.id === selectedProduct);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Product Design Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
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
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product-type">Choose Product Type</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product to customize" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Design Details */}
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

          {/* Generate Button */}
          <Button
            onClick={generateMockup}
            disabled={!selectedFile || !selectedProduct || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Generating AI Mockup...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Mockup
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Mockup Preview */}
      {generatedMockup && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Mockup Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={generatedMockup}
                alt="Generated product mockup"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{designName}</h3>
              {selectedProductData && (
                <p className="text-glee-purple font-bold text-xl">
                  ${selectedProductData.price.toFixed(2)}
                </p>
              )}
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
