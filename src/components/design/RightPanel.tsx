
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, ZoomIn, ShirtIcon } from 'lucide-react';
import { useDesign } from './DesignContext';

export const RightPanel = () => {
  const { currentView, setCurrentView, zoom, setZoom } = useDesign();

  const views = [
    { id: 'front', label: 'Front', image: '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png' },
    { id: 'back', label: 'Back', image: '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png' },
    { id: 'sleeve', label: 'Sleeve Design', image: '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png' }
  ];

  return (
    <div className="h-full p-4 space-y-4">
      {/* View Toggles */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          View
        </h3>
        <div className="space-y-2">
          {views.map(view => (
            <Card
              key={view.id}
              className={`p-3 cursor-pointer transition-colors ${
                currentView === view.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentView(view.id as any)}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={view.image} 
                  alt={view.label}
                  className="w-12 h-12 object-contain"
                />
                <span className="font-medium">{view.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Zoom Control */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ZoomIn className="w-4 h-4" />
          Zoom
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(50, zoom - 25))}
          >
            -
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
          >
            +
          </Button>
        </div>
      </div>

      {/* Change Product */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ShirtIcon className="w-4 h-4" />
          Change Product
        </h3>
        <Button variant="outline" className="w-full">
          Select Different Product
        </Button>
      </div>
    </div>
  );
};
