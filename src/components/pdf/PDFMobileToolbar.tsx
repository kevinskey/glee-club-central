
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Settings,
  MoreHorizontal,
  Maximize,
  Undo,
  Redo,
  Save,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Download,
  Printer,
  Palette,
  Type,
  Highlighter,
  Eraser,
  MousePointer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFMobileToolbarProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  showAnnotations: boolean;
  currentPageBookmarked: boolean;
  currentTool: string;
  canUndo: boolean;
  canRedo: boolean;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  onToggleAnnotations: () => void;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSaveAnnotations: () => void;
  onClearAnnotations: () => void;
  onToggleBookmark: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const PDFMobileToolbar: React.FC<PDFMobileToolbarProps> = ({
  pageNumber,
  numPages,
  scale,
  showAnnotations,
  currentPageBookmarked,
  currentTool,
  canUndo,
  canRedo,
  onPageChange,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleFullscreen,
  onToggleAnnotations,
  onToolChange,
  onUndo,
  onRedo,
  onSaveAnnotations,
  onClearAnnotations,
  onToggleBookmark,
  onDownload,
  onPrint
}) => {
  const [showTools, setShowTools] = useState(false);

  return (
    <>
      {/* Sticky Top Navigation */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-3">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={pageNumber <= 1}
              className="min-h-[44px] min-w-[44px]"
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
                className="w-12 h-10 text-center text-sm min-h-[44px]"
                min={1}
                max={numPages}
              />
              <span className="text-sm text-muted-foreground">
                /{numPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={pageNumber >= numPages}
              className="min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleBookmark}
              className="min-h-[44px] min-w-[44px]"
            >
              {currentPageBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            
            <Sheet open={showTools} onOpenChange={setShowTools}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>PDF Tools</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* View Controls */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">View Controls</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={onZoomOut}
                        disabled={scale <= 0.5}
                        className="min-h-[44px] justify-start"
                      >
                        <ZoomOut className="h-4 w-4 mr-2" />
                        Zoom Out
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onZoomIn}
                        disabled={scale >= 3.0}
                        className="min-h-[44px] justify-start"
                      >
                        <ZoomIn className="h-4 w-4 mr-2" />
                        Zoom In
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onRotate}
                        className="min-h-[44px] justify-start"
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onToggleFullscreen}
                        className="min-h-[44px] justify-start"
                      >
                        <Maximize className="h-4 w-4 mr-2" />
                        Fullscreen
                      </Button>
                    </div>
                  </div>

                  {/* Annotation Tools */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Annotation Tools</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={currentTool === 'none' ? 'default' : 'outline'}
                        onClick={() => onToolChange('none')}
                        className="min-h-[44px] justify-start"
                      >
                        <MousePointer className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                      <Button
                        variant={currentTool === 'pen' ? 'default' : 'outline'}
                        onClick={() => onToolChange('pen')}
                        className="min-h-[44px] justify-start"
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        Pen
                      </Button>
                      <Button
                        variant={currentTool === 'highlighter' ? 'default' : 'outline'}
                        onClick={() => onToolChange('highlighter')}
                        className="min-h-[44px] justify-start"
                      >
                        <Highlighter className="h-4 w-4 mr-2" />
                        Highlighter
                      </Button>
                      <Button
                        variant={currentTool === 'text' ? 'default' : 'outline'}
                        onClick={() => onToolChange('text')}
                        className="min-h-[44px] justify-start"
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Text
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="min-h-[44px] justify-start"
                      >
                        <Undo className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="min-h-[44px] justify-start"
                      >
                        <Redo className="h-4 w-4 mr-2" />
                        Redo
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={onToggleAnnotations}
                      className="w-full min-h-[44px] justify-start"
                    >
                      {showAnnotations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Actions</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="outline"
                        onClick={onSaveAnnotations}
                        className="min-h-[44px] justify-start"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Annotations
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onClearAnnotations}
                        className="min-h-[44px] justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Page Annotations
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onDownload}
                        className="min-h-[44px] justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onPrint}
                        className="min-h-[44px] justify-start"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Tool Access */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 w-12 rounded-full shadow-lg"
              variant={currentTool === 'none' ? 'outline' : 'default'}
            >
              {currentTool === 'pen' && <Palette className="h-5 w-5" />}
              {currentTool === 'highlighter' && <Highlighter className="h-5 w-5" />}
              {currentTool === 'text' && <Type className="h-5 w-5" />}
              {currentTool === 'eraser' && <Eraser className="h-5 w-5" />}
              {currentTool === 'none' && <MousePointer className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <div className="py-4">
              <div className="flex justify-center gap-4">
                <Button
                  variant={currentTool === 'none' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onToolChange('none')}
                  className="h-12 w-12"
                >
                  <MousePointer className="h-5 w-5" />
                </Button>
                <Button
                  variant={currentTool === 'pen' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onToolChange('pen')}
                  className="h-12 w-12"
                >
                  <Palette className="h-5 w-5" />
                </Button>
                <Button
                  variant={currentTool === 'highlighter' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onToolChange('highlighter')}
                  className="h-12 w-12"
                >
                  <Highlighter className="h-5 w-5" />
                </Button>
                <Button
                  variant={currentTool === 'text' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onToolChange('text')}
                  className="h-12 w-12"
                >
                  <Type className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
