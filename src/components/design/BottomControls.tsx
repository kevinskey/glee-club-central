
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, Share2, DollarSign, Plus } from 'lucide-react';
import { useDesign } from './DesignContext';

export const BottomControls = () => {
  const { selectedGarment } = useDesign();

  const handleSaveShare = () => {
    // Implementation for saving design
    console.log('Saving design...');
  };

  const handleGetPrice = () => {
    // Implementation for price calculation
    console.log('Calculating price...');
  };

  const handleAddProducts = () => {
    // Implementation for adding products
    console.log('Adding products...');
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Product Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <img 
              src="/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png"
              alt="Product"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h4 className="font-semibold">{selectedGarment.brand} {selectedGarment.style}</h4>
            <p className="text-sm text-gray-600">
              {selectedGarment.color} | <button className="text-blue-600 hover:underline">Change Color</button>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddProducts}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Products
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSaveShare}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save | Share
          </Button>
          <Button
            onClick={handleGetPrice}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Get Price
          </Button>
        </div>
      </div>
    </div>
  );
};
