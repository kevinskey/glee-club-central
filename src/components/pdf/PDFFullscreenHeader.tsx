
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  X
} from 'lucide-react';

interface PDFFullscreenHeaderProps {
  title: string;
  pageNumber: number;
  numPages: number;
  scale: number;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExitFullscreen: () => void;
}

export const PDFFullscreenHeader: React.FC<PDFFullscreenHeaderProps> = ({
  title,
  pageNumber,
  numPages,
  scale,
  onBack,
  onPageChange,
  onPrevPage,
  onNextPage,
  onRotate,
  onZoomIn,
  onZoomOut,
  onExitFullscreen
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 z-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Sheet Music
        </Button>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= numPages) {
                onPageChange(page);
              }
            }}
            className="w-12 h-8 text-center text-xs"
            min={1}
            max={numPages}
          />
          <span className="text-xs text-muted-foreground">
            /{numPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={onRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={onZoomOut} disabled={scale <= 0.5}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={onZoomIn} disabled={scale >= 3.0}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" onClick={onExitFullscreen}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
