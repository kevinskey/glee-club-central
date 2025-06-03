
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/utils/permissionChecker";

interface UploadMediaButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export function UploadMediaButton({ 
  onClick, 
  label = "Upload Media",
  disabled = false 
}: UploadMediaButtonProps) {
  const { user, profile } = useAuth();
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check if user has permission to upload media
  const canUpload = !!user && hasPermission(currentUser, 'upload_media');
  
  if (!canUpload) {
    return null;
  }

  const handleClick = () => {
    console.log("Upload button clicked");
    onClick();
  };
  
  return (
    <Button 
      onClick={handleClick}
      disabled={disabled}
      className="bg-glee-purple hover:bg-glee-purple/90 text-white"
    >
      <Upload className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
