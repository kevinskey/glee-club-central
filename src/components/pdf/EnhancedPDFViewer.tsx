
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  BookmarkCheck,
  ArrowLeft, 
  ArrowRight, 
  Layers,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedPDFViewerProps {
  url: string;
  title: string;
  onBack?: () => void;
}

const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({ 
  url, 
  title,
  onBack 
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  
  // Function to zoom in
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  };
  
  // Function to zoom out
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };
  
  // Function to rotate
  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  // Function to toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(prev => !prev);
    
    // Save bookmark to local storage or database
    if (!isBookmarked) {
      toast.success("Page bookmarked", {
        description: `Bookmarked page ${currentPage} in ${title}`
      });
    } else {
      toast.info("Bookmark removed");
    }
  };
  
  // Function to go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Function to go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === '+') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === 'r') {
        rotate();
      } else if (e.key === 'b') {
        toggleBookmark();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]);

  // Effect to update the iframe with scale and rotation
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      const pdfViewer = iframe.contentDocument.querySelector('iframe');
      if (pdfViewer) {
        pdfViewer.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        pdfViewer.style.transformOrigin = 'center center';
      }
    }
  }, [scale, rotation]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-muted p-2 rounded-md mb-2">
        <div className="flex items-center">
          <Button variant="outline" onClick={handleBack} size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-lg font-medium truncate max-w-md">{title}</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={prevPage} disabled={currentPage <= 1}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous Page</TooltipContent>
            </Tooltip>
            
            <div className="text-sm mx-2">
              Page {currentPage} of {totalPages}
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={nextPage} disabled={currentPage >= totalPages}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next Page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            
            <div className="w-24 mx-2">
              <Slider 
                value={[scale * 100]} 
                min={50} 
                max={300} 
                step={25} 
                onValueChange={(value) => setScale(value[0] / 100)} 
              />
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={rotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isBookmarked ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={toggleBookmark}
                >
                  <BookmarkCheck className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isBookmarked ? "Remove Bookmark" : "Add Bookmark"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 border rounded-md shadow-sm overflow-hidden bg-white">
        <iframe 
          ref={iframeRef}
          src={`${url}#page=${currentPage}&zoom=${scale * 100}&toolbar=0&view=FitH`}
          title={title}
          className="w-full h-full"
          onLoad={() => {
            // Attempt to detect total pages - this is a simplified approach
            // Advanced PDF libraries would provide better page detection
            setTimeout(() => {
              setTotalPages(Math.max(totalPages, 1));
            }, 1000);
          }}
          allowFullScreen
        />
      </div>
      
      <div className="mt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <Layers className="h-4 w-4 mr-2" /> Back to Library
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <a href={url} download target="_blank" rel="noreferrer">
            <FileText className="h-4 w-4 mr-2" /> Download PDF
          </a>
        </Button>
      </div>
    </div>
  );
};

export default EnhancedPDFViewer;
