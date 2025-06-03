
import React from 'react';
import { useDesign } from './DesignContext';

export const GarmentPreview = () => {
  const { elements, currentView, zoom, selectedGarment } = useDesign();

  const getGarmentImage = () => {
    // This would be replaced with actual garment images
    return '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png'; // Using existing white shirt image
  };

  const visibleElements = elements.filter(el => el.placement === currentView);

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="relative" style={{ transform: `scale(${zoom / 100})` }}>
        {/* Garment Image */}
        <img
          src={getGarmentImage()}
          alt={`${selectedGarment.brand} ${selectedGarment.style}`}
          className="max-h-[600px] max-w-[400px] object-contain"
        />

        {/* Design Elements Overlay */}
        <div className="absolute inset-0">
          {visibleElements.map(element => (
            <div
              key={element.id}
              className="absolute cursor-move border border-dashed border-blue-400 hover:border-blue-600"
              style={{
                left: element.x,
                top: element.y,
                width: element.width || 'auto',
                height: element.height || 'auto'
              }}
            >
              {element.type === 'text' && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.fontFamily,
                    color: element.color
                  }}
                  className="select-none whitespace-nowrap"
                >
                  {element.content}
                </span>
              )}
              
              {element.type === 'image' && (
                <img
                  src={element.content}
                  alt="Design element"
                  className="w-full h-full object-contain"
                />
              )}
              
              {element.type === 'clipart' && (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                  {element.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Placement Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {currentView === 'front' && (
            <>
              {/* Full Front */}
              <div className="absolute top-20 left-8 right-8 bottom-20 border border-green-400 border-dashed opacity-30"></div>
              {/* Left Chest */}
              <div className="absolute top-20 right-8 w-16 h-16 border border-blue-400 border-dashed opacity-30"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
