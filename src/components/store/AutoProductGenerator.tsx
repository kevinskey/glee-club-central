
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DESIGN_PLACEMENTS = [
  { id: 'full-front', name: 'Full Front', description: 'Large center chest design' },
  { id: 'full-back', name: 'Full Back', description: 'Large back design' },
  { id: 'left-chest', name: 'Left Chest', description: 'Small logo placement' },
  { id: 'pocket', name: 'Pocket Design', description: 'Small pocket-sized design' },
  { id: 'sleeve', name: 'Sleeve/Arm', description: 'Sleeve placement' },
];

const PRODUCT_TYPES = [
  { id: 't-shirt', name: 'T-Shirt', basePrice: 25.00, category: 'apparel' },
  { id: 'sweatshirt', name: 'Sweatshirt', basePrice: 45.00, category: 'apparel' },
  { id: 'hoodie', name: 'Hoodie', basePrice: 50.00, category: 'apparel' },
  { id: 'zip-hoodie', name: 'Zip Hoodie', basePrice: 55.00, category: 'apparel' },
  { id: 'letterman-jacket', name: "Letterman's Jacket", basePrice: 120.00, category: 'apparel' },
  { id: 'hat', name: 'Baseball Cap', basePrice: 25.00, category: 'accessories' },
  { id: 'beanie', name: 'Beanie', basePrice: 20.00, category: 'accessories' },
  { id: 'bucket-hat', name: 'Bucket Hat', basePrice: 28.00, category: 'accessories' },
  { id: 'scarf', name: 'Scarf', basePrice: 35.00, category: 'accessories' },
  { id: 'mug', name: 'Coffee Mug', basePrice: 15.00, category: 'drinkware' },
  { id: 'water-bottle', name: 'Water Bottle', basePrice: 30.00, category: 'drinkware' },
  { id: 'stickers', name: 'Sticker Pack', basePrice: 8.00, category: 'accessories' },
];

const CONCERT_TYPES = [
  { id: 'in-town', name: 'Concert in Town', basePrice: 35.00 },
  { id: 'on-tour', name: 'Concert on Tour', basePrice: 40.00 },
  { id: 'with-80', name: 'Concert with 80', basePrice: 45.00 },
  { id: 'with-60', name: 'Concert with 60', basePrice: 42.00 },
  { id: 'with-40', name: 'Concert with 40', basePrice: 40.00 },
  { id: 'with-20', name: 'Concert with 20', basePrice: 38.00 },
  { id: 'with-8', name: 'Concert with 8', basePrice: 35.00 },
  { id: 'with-4', name: 'Concert with 4', basePrice: 33.00 },
  { id: 'with-1', name: 'Concert with 1', basePrice: 30.00 },
];

const RECORDING_TYPES = [
  { id: 'cd-single', name: 'CD Single', basePrice: 12.00 },
  { id: 'cd-album', name: 'CD Album', basePrice: 18.00 },
  { id: 'digital-download', name: 'Digital Download', basePrice: 8.00 },
];

const DESIGN_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1F2937' },
  { name: 'Spelman Blue', hex: '#0066CC' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Silver', hex: '#C0C0C0' },
];

export function AutoProductGenerator() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['full-front']);
  const [selectedDesignColor, setSelectedDesignColor] = useState(DESIGN_COLORS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const designImageUrl = '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png';

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const togglePlacementSelection = (placementId: string) => {
    setSelectedPlacements(prev => 
      prev.includes(placementId) 
        ? prev.filter(id => id !== placementId)
        : [...prev, placementId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(PRODUCT_TYPES.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const generateAllProducts = async () => {
    if (selectedProducts.length === 0 || selectedPlacements.length === 0) {
      toast.error('Please select at least one product type and placement');
      return;
    }

    setIsGenerating(true);
    setGeneratedCount(0);
    let successCount = 0;

    try {
      // Generate base products
      for (const productId of selectedProducts) {
        const product = PRODUCT_TYPES.find(p => p.id === productId);
        if (!product) continue;

        for (const placementId of selectedPlacements) {
          const placement = DESIGN_PLACEMENTS.find(p => p.id === placementId);
          if (!placement) continue;

          try {
            // Generate AI mockup for this product/placement combination
            const { data, error } = await supabase.functions.invoke('generate-product-mockup', {
              body: {
                userImageUrl: designImageUrl,
                productType: productId,
                designName: `Spelman Glee Club ${product.name}`,
                designDescription: `${placement.name} placement on ${product.name}`,
                brandInfo: {
                  brand: 'nextlevel',
                  color: { name: 'Black', hex: '#000000', code: 'NL3600-Black' }
                },
                designColor: selectedDesignColor,
                placement: placementId,
                amazonStyle: true,
                singleMockup: true
              }
            });

            if (error) throw error;

            // Create store item
            await supabase
              .from('store_items')
              .insert({
                name: `${product.name} - ${placement.name} - ${selectedDesignColor.name}`,
                description: `Spelman College Glee Club ${product.name} with ${placement.description} in ${selectedDesignColor.name}`,
                price: product.basePrice + 10, // Add design fee
                image_url: data.mockupUrl,
                tags: ['spelman-glee', 'auto-generated', product.category, placementId, selectedDesignColor.name.toLowerCase()],
                quantity_in_stock: 999,
                is_active: true
              });

            successCount++;
            setGeneratedCount(successCount);
          } catch (error) {
            console.error(`Failed to generate ${product.name} with ${placement.name}:`, error);
          }
        }
      }

      // Generate concert products
      for (const concertType of CONCERT_TYPES) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-product-mockup', {
            body: {
              userImageUrl: designImageUrl,
              productType: 't-shirt',
              designName: `${concertType.name} Commemorative Tee`,
              designDescription: `Special edition ${concertType.name} merchandise`,
              brandInfo: {
                brand: 'comfortcolors',
                color: { name: 'Black', hex: '#000000', code: 'CC1717-Black' }
              },
              designColor: selectedDesignColor,
              amazonStyle: true,
              singleMockup: true
            }
          });

          if (error) throw error;

          await supabase
            .from('store_items')
            .insert({
              name: `${concertType.name} - Commemorative Tee`,
              description: `Special edition ${concertType.name} commemorative t-shirt`,
              price: concertType.basePrice,
              image_url: data.mockupUrl,
              tags: ['spelman-glee', 'concert', 'commemorative', 'auto-generated'],
              quantity_in_stock: 999,
              is_active: true
            });

          successCount++;
          setGeneratedCount(successCount);
        } catch (error) {
          console.error(`Failed to generate ${concertType.name}:`, error);
        }
      }

      // Generate recording products
      for (const recordingType of RECORDING_TYPES) {
        try {
          await supabase
            .from('store_items')
            .insert({
              name: `Spelman Glee Club - ${recordingType.name}`,
              description: `Official Spelman College Glee Club ${recordingType.name}`,
              price: recordingType.basePrice,
              image_url: designImageUrl, // Use the logo as placeholder
              tags: ['spelman-glee', 'recording', 'music', 'auto-generated'],
              quantity_in_stock: 999,
              is_active: true
            });

          successCount++;
          setGeneratedCount(successCount);
        } catch (error) {
          console.error(`Failed to generate ${recordingType.name}:`, error);
        }
      }

      toast.success(`Successfully generated ${successCount} products!`);
    } catch (error) {
      console.error('Error generating products:', error);
      toast.error('Failed to generate some products. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalProducts = selectedProducts.length * selectedPlacements.length + CONCERT_TYPES.length + RECORDING_TYPES.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Auto Product Generator - Spelman Glee Club Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Design Preview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={designImageUrl} 
              alt="Spelman Glee Club Design" 
              className="w-16 h-16 object-contain bg-white rounded border"
            />
            <div>
              <h3 className="font-semibold">Base Design: Spelman College Glee Club Logo</h3>
              <p className="text-sm text-gray-600">This design will be applied to all selected products</p>
            </div>
          </div>

          {/* Design Color Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Design Color</h3>
            <div className="flex gap-2">
              {DESIGN_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedDesignColor(color)}
                  className={`
                    relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110
                    ${selectedDesignColor.name === color.name 
                      ? 'border-gray-900 ring-2 ring-gray-400' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {color.hex === '#FFFFFF' && (
                    <div className="absolute inset-0 rounded-full border border-gray-200" />
                  )}
                  {selectedDesignColor.name === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${
                        color.hex === '#FFFFFF' ? 'bg-gray-800' : 'bg-white'
                      }`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">Selected: {selectedDesignColor.name}</p>
          </div>

          {/* Design Placements */}
          <div className="space-y-3">
            <h3 className="font-semibold">Design Placements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DESIGN_PLACEMENTS.map((placement) => (
                <button
                  key={placement.id}
                  onClick={() => togglePlacementSelection(placement.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedPlacements.includes(placement.id)
                      ? 'border-glee-spelman bg-glee-spelman/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{placement.name}</div>
                  <div className="text-xs text-gray-600">{placement.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Types */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Product Types</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllProducts}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRODUCT_TYPES.map((product) => (
                <button
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedProducts.includes(product.id)
                      ? 'border-glee-spelman bg-glee-spelman/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-600">${product.basePrice}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {product.category}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Generation Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Generation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Base Products:</span>
                <div>{selectedProducts.length} × {selectedPlacements.length} = {selectedProducts.length * selectedPlacements.length}</div>
              </div>
              <div>
                <span className="font-medium">Concert Items:</span>
                <div>{CONCERT_TYPES.length} commemorative items</div>
              </div>
              <div>
                <span className="font-medium">Recordings:</span>
                <div>{RECORDING_TYPES.length} music products</div>
              </div>
            </div>
            <div className="mt-2 font-semibold">
              Total Products to Generate: {totalProducts}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateAllProducts}
            disabled={isGenerating || selectedProducts.length === 0}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Generating... ({generatedCount}/{totalProducts})
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Generate {totalProducts} Products
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
