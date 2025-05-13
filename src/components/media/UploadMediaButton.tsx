
import React from "react";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UploadMediaButtonProps {
  onClick: () => void;
  canUpload?: boolean;
  label?: string;
}

export function UploadMediaButton({ 
  onClick, 
  canUpload: canUploadProp,
  label = "Upload Media"
}: UploadMediaButtonProps) {
  const { user } = useAuth();
  
  // If canUpload is explicitly provided, use it, otherwise allow any authenticated user
  const canUpload = canUploadProp !== undefined ? canUploadProp : !!user;
  
  if (!canUpload) return null;
  
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onClick} className="bg-brand hover:bg-brand/90">
        <FileUp className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}
