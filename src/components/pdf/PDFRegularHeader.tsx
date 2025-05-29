
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
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
  Home,
  Music
} from 'lucide-react';

interface PDFRegularHeaderProps {
  title: string;
  pageNumber: number;
  numPages: number;
  scale: number;
  rotation: number;
  showAnnotations: boolean;
  currentPageBookmarked: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  onToggleAnnotations: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSaveAnnotations: () => void;
  onClearAnnotations: () => void;
  onToggleBookmark: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const PDFRegularHeader: React.FC<PDFRegularHeaderProps> = ({
  title,
  pageNumber,
  numPages,
  scale,
  rotation,
  showAnnotations,
  currentPageBookmarked,
  canUndo,
  canRedo,
  onBack,
  onPageChange,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleFullscreen,
  onToggleAnnotations,
  onUndo,
  onRedo,
  onSaveAnnotations,
  onClearAnnotations,
  onToggleBookmark,
  onDownload,
  onPrint
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14">
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-3 w-3" />
          <span>/</span>
          <Music className="h-3 w-3" />
          <span>Sheet Music</span>
          <span>/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-1 ml-4">
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
        </div>
      </div>

      {/* Center Section - Title */}
      <div className="hidden md:flex flex-1 justify-center">
        <h3 className="font-medium text-sm truncate max-w-[300px]">{title}</h3>
      </div>
      
      {/* Right Section - Tool Dropdowns */}
      <div className="flex items-center gap-1">
        {/* View Controls Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out ({Math.round(scale * 100)}%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onZoomIn} disabled={scale >= 3.0}>
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In ({Math.round(scale * 100)}%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRotate}>
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate ({rotation}°)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleFullscreen}>
              <Maximize className="h-4 w-4 mr-2" />
              Enter Fullscreen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleAnnotations}>
              {showAnnotations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Annotation Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onUndo} disabled={!canUndo}>
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRedo} disabled={!canRedo}>
              <Redo className="h-4 w-4 mr-2" />
              Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSaveAnnotations}>
              <Save className="h-4 w-4 mr-2" />
              Save Annotations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClearAnnotations}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Page Annotations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onToggleBookmark}>
              {currentPageBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
              {currentPageBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
