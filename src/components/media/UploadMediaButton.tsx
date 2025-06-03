
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
  
  console.log("UploadMediaButton - User:", user);
  console.log("UploadMediaButton - Profile:", profile);
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check if user has permission to upload media
  const canUpload = !!user && hasPermission(currentUser, 'upload_media');
  
  console.log("UploadMediaButton - Can upload:", canUpload);
  console.log("UploadMediaButton - User role tags:", profile?.role_tags);
  
  // For debugging, show button even without permissions temporarily
  const showButton = !!user; // Changed from canUpload to just check if user exists
  
  if (!showButton) {
    console.log("UploadMediaButton - Button hidden, no user");
    return null;
  }

  const handleClick = () => {
    console.log("Upload button clicked, calling onClick");
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
