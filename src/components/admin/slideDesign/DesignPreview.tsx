
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlideDesign, SlideTemplate } from '@/types/slideDesign';
import { Play, X, Maximize2 } from 'lucide-react';

interface DesignPreviewProps {
  design?: SlideDesign;
  template?: SlideTemplate;
  onClose: () => void;
  onFullscreen?: () => void;
}

export function DesignPreview({ design, template, onClose, onFullscreen }: DesignPreviewProps) {
  const textElements = design?.design_data?.textElements || 
    template?.template_data?.textAreas?.map(area => ({
      id: area.id,
      type: area.type,
      text: area.defaultText,
      position: area.position,
      style: area.style
    })) || [];

  const backgroundColor = design?.background_color || template?.default_styles?.backgroundColor || '#4A90E2';
  const backgroundImage = design?.background_image_url;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg">
            Preview: {design?.title || template?.name || 'Untitled'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onFullscreen && (
              <Button onClick={onFullscreen} size="sm" variant="outline">
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={onClose} size="sm" variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div
              className="relative bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                width: '800px',
                height: '450px',
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Text Elements */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    ...element.style,
                    fontSize: `clamp(0.75rem, ${element.style.fontSize || '1rem'}, 3rem)`,
                    textShadow: element.style.textShadow || '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {element.text}
                </div>
              ))}

              {/* Preview Overlay */}
              <div className="absolute top-4 right-4 bg-black/20 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Play className="h-3 w-3" />
                Preview Mode
              </div>
            </div>
          </div>

          {/* Design Info */}
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              <p><strong>Layout:</strong> {design?.layout_type || template?.layout_type || 'Full'}</p>
              {design?.description && <p><strong>Description:</strong> {design.description}</p>}
              {template?.description && <p><strong>Template:</strong> {template.description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
