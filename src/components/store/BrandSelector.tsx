
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const BRAND_TIERS = [
  {
    id: 'gildan',
    name: 'Standard',
    brand: 'Gildan Heavy Cotton',
    model: 'G500',
    price: 15.00,
    description: 'Classic cotton tee, great for everyday wear',
    features: ['100% Cotton', 'Pre-shrunk', 'Tearaway label']
  },
  {
    id: 'nextlevel',
    name: 'Premium',
    brand: 'Next Level / Bella Canvas',
    model: 'NL3600 / BC3001',
    price: 22.00,
    description: 'Soft, fitted unisex tee with modern styling',
    features: ['Cotton/Poly blend', 'Side-seamed', 'Retail fit', 'Tear-away label']
  },
  {
    id: 'comfortcolors',
    name: 'Luxury',
    brand: 'Comfort Colors',
    model: 'CC1717',
    price: 28.00,
    description: 'Garment-dyed vintage feel with unique colors',
    features: ['100% Cotton', 'Garment-dyed', 'Vintage look', 'Soft hand feel']
  }
];

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandSelect: (brandId: string) => void;
}

export function BrandSelector({ selectedBrand, onBrandSelect }: BrandSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Choose Quality Tier</Label>
      <RadioGroup value={selectedBrand} onValueChange={onBrandSelect}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BRAND_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBrand === tier.id ? 'ring-2 ring-glee-spelman' : ''
              }`}
              onClick={() => onBrandSelect(tier.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={tier.id} id={tier.id} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">{tier.name}</h3>
                        <p className="text-xs text-gray-600">{tier.brand}</p>
                        <p className="text-xs text-gray-500">{tier.model}</p>
                      </div>
                      <span className="text-lg font-bold text-glee-spelman">
                        +${tier.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tier.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tier.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
