
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer = ({ url, title }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF. Please try again later.");
    toast({
      title: "Error loading PDF",
      description: "The PDF could not be loaded. Please try again later.",
      variant: "destructive",
    });
  };
  
  return (
    <div className="relative flex flex-col w-full rounded-lg border border-border">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="relative w-full h-[70vh]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <p className="mb-4 text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.open(url, "_blank")}
                variant="outline"
              >
                Download PDF Instead
              </Button>
            </div>
          </div>
        ) : (
          <iframe 
            src={`${url}#toolbar=0&navpanes=0`}
            className="w-full h-full" 
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
      
      <div className="p-4 border-t bg-muted/30 flex justify-between">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          Back to Library
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={() => window.open(url, "_blank")}
        >
          Open in New Tab
        </Button>
      </div>
    </div>
  );
};
