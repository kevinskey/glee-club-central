
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface MultipleDownloadBarProps {
  selectedFiles: {
    id: string;
    title: string;
    file_url: string;
  }[];
  onClearSelection: () => void;
}

export function MultipleDownloadBar({ selectedFiles, onClearSelection }: MultipleDownloadBarProps) {
  const downloadSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      toast.info(`Preparing ${selectedFiles.length} file(s) for download...`);
      
      // For each file, trigger a download
      selectedFiles.forEach((file, index) => {
        if (!file.file_url) {
          console.error(`Missing URL for file: ${file.title}`);
          return;
        }
        
        setTimeout(() => {
          // Create link element for download
          const link = document.createElement("a");
          link.href = file.file_url;
          link.setAttribute("download", `${file.title.replace(/\s+/g, "_")}.pdf`);
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 500); // Stagger downloads to avoid browser limitations
      });
      
      toast.success(`${selectedFiles.length} file(s) queued for download`);
    } catch (error) {
      console.error("Error downloading files:", error);
      toast.error("Failed to download some files");
    }
  };

  if (selectedFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border shadow-lg rounded-lg px-4 py-3 flex items-center justify-between w-11/12 max-w-xl">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{selectedFiles.length} file(s) selected</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={downloadSelectedFiles} 
          className="bg-glee-purple hover:bg-glee-purple/90"
        >
          <Download className="h-4 w-4 mr-1" /> Download All
        </Button>
      </div>
    </div>
  );
}
