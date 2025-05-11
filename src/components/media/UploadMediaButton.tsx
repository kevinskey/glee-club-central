
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UploadMediaButtonProps {
  onClick: () => void;
  canUpload: boolean;
}

export function UploadMediaButton({ onClick, canUpload }: UploadMediaButtonProps) {
  const isMobile = useIsMobile();
  
  if (!canUpload) return null;
  
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onClick}
        className="flex items-center gap-2"
        size={isMobile ? "default" : "lg"}
      >
        <Upload className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> 
        {isMobile ? "Upload" : "Upload Media File"}
      </Button>
    </div>
  );
}
