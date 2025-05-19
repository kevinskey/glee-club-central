
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadMediaButtonProps {
  onClick: () => void;
  canUpload: boolean;
  label?: string;
}

export function UploadMediaButton({ onClick, canUpload, label = "Upload Media" }: UploadMediaButtonProps) {
  if (!canUpload) {
    return null;
  }
  
  return (
    <Button 
      onClick={onClick}
      className="bg-glee-purple hover:bg-glee-purple/90 text-white"
    >
      <Upload className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
