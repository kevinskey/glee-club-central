
import React from 'react';
import { Label } from '@/components/ui/label';

// Color swatches for different brands
const BRAND_COLORS = {
  gildan: [
    { name: 'White', hex: '#FFFFFF', code: 'G500-White' },
    { name: 'Black', hex: '#000000', code: 'G500-Black' },
    { name: 'Navy', hex: '#1F2937', code: 'G500-Navy' },
    { name: 'Royal Blue', hex: '#2563EB', code: 'G500-Royal' },
    { name: 'Red', hex: '#DC2626', code: 'G500-Red' },
    { name: 'Forest Green', hex: '#166534', code: 'G500-Forest' },
    { name: 'Maroon', hex: '#991B1B', code: 'G500-Maroon' },
    { name: 'Purple', hex: '#7C3AED', code: 'G500-Purple' },
    { name: 'Orange', hex: '#EA580C', code: 'G500-Orange' },
    { name: 'Yellow', hex: '#EAB308', code: 'G500-Yellow' },
    { name: 'Pink', hex: '#EC4899', code: 'G500-Pink' },
    { name: 'Light Blue', hex: '#0EA5E9', code: 'G500-LightBlue' },
    { name: 'Heather Grey', hex: '#9CA3AF', code: 'G500-HeatherGrey' },
    { name: 'Ash Grey', hex: '#D1D5DB', code: 'G500-AshGrey' },
  ],
  nextlevel: [
    { name: 'White', hex: '#FFFFFF', code: 'NL3600-White' },
    { name: 'Black', hex: '#000000', code: 'NL3600-Black' },
    { name: 'Navy', hex: '#1F2937', code: 'NL3600-Navy' },
    { name: 'Royal', hex: '#2563EB', code: 'NL3600-Royal' },
    { name: 'Red', hex: '#DC2626', code: 'NL3600-Red' },
    { name: 'Kelly Green', hex: '#16A34A', code: 'NL3600-Kelly' },
    { name: 'Purple', hex: '#7C3AED', code: 'NL3600-Purple' },
    { name: 'Orange', hex: '#EA580C', code: 'NL3600-Orange' },
    { name: 'Tahiti Blue', hex: '#0891B2', code: 'NL3600-Tahiti' },
    { name: 'Hot Pink', hex: '#EC4899', code: 'NL3600-HotPink' },
    { name: 'Heather Grey', hex: '#9CA3AF', code: 'NL3600-HeatherGrey' },
    { name: 'Vintage Black', hex: '#374151', code: 'NL3600-VintageBlack' },
    { name: 'Vintage Navy', hex: '#1E3A8A', code: 'NL3600-VintageNavy' },
    { name: 'Heather White', hex: '#F9FAFB', code: 'NL3600-HeatherWhite' },
  ],
  comfortcolors: [
    { name: 'White', hex: '#FFFFFF', code: 'CC1717-White' },
    { name: 'Black', hex: '#000000', code: 'CC1717-Black' },
    { name: 'Blue Jean', hex: '#4F46E5', code: 'CC1717-BlueJean' },
    { name: 'Crimson', hex: '#DC2626', code: 'CC1717-Crimson' },
    { name: 'Forest', hex: '#166534', code: 'CC1717-Forest' },
    { name: 'Mustard', hex: '#D97706', code: 'CC1717-Mustard' },
    { name: 'Pepper', hex: '#DC2626', code: 'CC1717-Pepper' },
    { name: 'Seafoam', hex: '#10B981', code: 'CC1717-Seafoam' },
    { name: 'Sky', hex: '#0EA5E9', code: 'CC1717-Sky' },
    { name: 'Violet', hex: '#8B5CF6', code: 'CC1717-Violet' },
    { name: 'Watermelon', hex: '#F472B6', code: 'CC1717-Watermelon' },
    { name: 'Yam', hex: '#EA580C', code: 'CC1717-Yam' },
    { name: 'Butter', hex: '#FDE047', code: 'CC1717-Butter' },
    { name: 'Granite', hex: '#6B7280', code: 'CC1717-Granite' },
  ]
};

interface ColorSelectorProps {
  selectedBrand: string;
  selectedColor: { name: string; hex: string; code: string } | null;
  onColorSelect: (color: { name: string; hex: string; code: string }) => void;
}

export function ColorSelector({ selectedBrand, selectedColor, onColorSelect }: ColorSelectorProps) {
  const colors = BRAND_COLORS[selectedBrand as keyof typeof BRAND_COLORS] || [];

  if (!selectedBrand || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label>Select Garment Color</Label>
      <div className="grid grid-cols-7 gap-2">
        {colors.map((color) => (
          <button
            key={color.code}
            onClick={() => onColorSelect(color)}
            className={`
              relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110
              ${selectedColor?.code === color.code 
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
            {selectedColor?.code === color.code && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${
                  color.hex === '#FFFFFF' || color.hex === '#F9FAFB' ? 'bg-gray-800' : 'bg-white'
                }`} />
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-gray-600">
          Selected: {selectedColor.name} ({selectedColor.code})
        </p>
      )}
    </div>
  );
}
