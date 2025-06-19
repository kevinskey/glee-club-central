
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Shirt, Calculator } from 'lucide-react';

export function BlankSourcingCalculator() {
  const [itemType, setItemType] = useState<string>('tshirt');
  const [quality, setQuality] = useState<string>('standard');
  const [quantity, setQuantity] = useState<number>(0);
  const [results, setResults] = useState<any>(null);

  const itemPricing = {
    'tshirt': {
      name: 'T-Shirt',
      standard: { price: 4.50, name: 'Standard Cotton' },
      premium: { price: 8.75, name: 'Premium Blend' },
      organic: { price: 12.25, name: 'Organic Cotton' }
    },
    'hoodie': {
      name: 'Hoodie',
      standard: { price: 18.50, name: 'Standard Fleece' },
      premium: { price: 28.75, name: 'Premium Fleece' },
      organic: { price: 35.50, name: 'Organic Cotton' }
    },
    'totebag': {
      name: 'Tote Bag',
      standard: { price: 3.25, name: 'Canvas' },
      premium: { price: 6.50, name: 'Heavy Canvas' },
      organic: { price: 8.75, name: 'Organic Canvas' }
    },
    'mug': {
      name: 'Mug',
      standard: { price: 2.85, name: 'Ceramic' },
      premium: { price: 4.25, name: 'Premium Ceramic' },
      organic: { price: 5.50, name: 'Eco-Friendly' }
    }
  };

  const calculateBlankCosts = () => {
    const item = itemPricing[itemType as keyof typeof itemPricing];
    const qualityTier = item[quality as keyof typeof item] as { price: number; name: string };
    
    let unitPrice = qualityTier.price;
    
    // Quantity discounts
    let discount = 0;
    if (quantity >= 144) discount = 0.20;      // Case pricing
    else if (quantity >= 72) discount = 0.15;  // Half case
    else if (quantity >= 36) discount = 0.10;  // Quarter case
    else if (quantity >= 12) discount = 0.05;  // Dozen
    
    const discountedPrice = unitPrice * (1 - discount);
    const subtotal = discountedPrice * quantity;
    
    // Shipping estimation
    let shippingCost = 0;
    if (subtotal < 99) {
      shippingCost = 15.99;
    } else if (subtotal < 199) {
      shippingCost = 9.99;
    }
    // Free shipping over $199
    
    const totalCost = subtotal + shippingCost;
    
    setResults({
      itemName: item.name,
      qualityName: qualityTier.name,
      unitPrice: unitPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discount: (discount * 100).toFixed(0),
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      quantity,
      finalUnitCost: (totalCost / quantity).toFixed(2)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt className="h-5 w-5" />
          Blank Merchandise Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Item Type</Label>
            <Select value={itemType} onValueChange={setItemType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tshirt">T-Shirt</SelectItem>
                <SelectItem value="hoodie">Hoodie</SelectItem>
                <SelectItem value="totebag">Tote Bag</SelectItem>
                <SelectItem value="mug">Mug</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quality Tier</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="organic">Organic/Eco</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="36"
            min="1"
          />
        </div>
        
        <Button onClick={calculateBlankCosts} className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Blank Costs
        </Button>
        
        {results && (
          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Blank Merchandise Quote</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span>{results.itemName} - {results.qualityName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{results.quantity} pieces</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Unit Price:</span>
                  <span>${results.unitPrice}</span>
                </div>
                {results.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Quantity Discount ({results.discount}%):</span>
                    <span>-${(results.unitPrice - results.discountedPrice).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Discounted Unit Price:</span>
                  <span>${results.discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${results.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${results.shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Cost:</span>
                  <span>${results.totalCost}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Final cost per piece:</span>
                  <span>${results.finalUnitCost}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
