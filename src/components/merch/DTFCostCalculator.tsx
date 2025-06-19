
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Printer, DollarSign } from 'lucide-react';

export function DTFCostCalculator() {
  const [designSize, setDesignSize] = useState<string>('medium');
  const [quantity, setQuantity] = useState<number>(0);
  const [colors, setColors] = useState<number>(4);
  const [results, setResults] = useState<any>(null);

  const sizePricing = {
    'small': { basePrice: 2.50, name: 'Small (4" x 4")' },
    'medium': { basePrice: 3.75, name: 'Medium (8" x 10")' },
    'large': { basePrice: 5.25, name: 'Large (11" x 14")' },
    'xlarge': { basePrice: 7.00, name: 'Extra Large (12" x 16")' }
  };

  const calculateDTFCosts = () => {
    const size = sizePricing[designSize as keyof typeof sizePricing];
    let unitPrice = size.basePrice;
    
    // Color complexity multiplier
    if (colors > 4) {
      unitPrice *= 1.2;
    } else if (colors <= 2) {
      unitPrice *= 0.9;
    }
    
    // Quantity discounts
    let discount = 0;
    if (quantity >= 100) discount = 0.15;
    else if (quantity >= 50) discount = 0.10;
    else if (quantity >= 25) discount = 0.05;
    
    const discountedPrice = unitPrice * (1 - discount);
    const totalCost = discountedPrice * quantity;
    const setupFee = quantity < 25 ? 25 : 0;
    const finalTotal = totalCost + setupFee;
    
    setResults({
      size: size.name,
      unitPrice: unitPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discount: (discount * 100).toFixed(0),
      totalCost: totalCost.toFixed(2),
      setupFee: setupFee.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
      quantity
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          DTF Printing Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Design Size</Label>
            <Select value={designSize} onValueChange={setDesignSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (4" x 4")</SelectItem>
                <SelectItem value="medium">Medium (8" x 10")</SelectItem>
                <SelectItem value="large">Large (11" x 14")</SelectItem>
                <SelectItem value="xlarge">Extra Large (12" x 16")</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="50"
              min="1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="colors">Number of Colors</Label>
          <Input
            id="colors"
            type="number"
            value={colors}
            onChange={(e) => setColors(Number(e.target.value))}
            placeholder="4"
            min="1"
            max="12"
          />
        </div>
        
        <Button onClick={calculateDTFCosts} className="w-full">
          <DollarSign className="h-4 w-4 mr-2" />
          Calculate DTF Costs
        </Button>
        
        {results && (
          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">DTF Printing Quote</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Design Size:</span>
                  <span>{results.size}</span>
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
                    <span>Discount ({results.discount}%):</span>
                    <span>-${(results.unitPrice - results.discountedPrice).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Final Unit Price:</span>
                  <span>${results.discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${results.totalCost}</span>
                </div>
                {results.setupFee > 0 && (
                  <div className="flex justify-between">
                    <span>Setup Fee:</span>
                    <span>${results.setupFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Cost:</span>
                  <span>${results.finalTotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cost per piece:</span>
                  <span>${(results.finalTotal / results.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
