
import React from "react";
import { Mic, Music, Headphones, Album, FileAudio } from "lucide-react";
import { AudioPageCategory } from "@/types/audio";

interface AudioCategoryIconProps {
  category: AudioPageCategory;
  size?: "small" | "medium" | "large";
}

export function AudioCategoryIcon({ category, size = "small" }: AudioCategoryIconProps) {
  // Determine icon size based on size prop
  const iconSize = size === "large" ? "h-12 w-12" : 
                   size === "medium" ? "h-5 w-5" : "h-4 w-4";
  
  const getIconClass = () => {
    return `${iconSize} ${getIconColorClass()}`;
  };
  
  // Get appropriate color based on category
  const getIconColorClass = () => {
    switch (category) {
      case "recordings":
        return "text-red-500";
      case "part_tracks":
        return "text-blue-500";
      case "my_tracks":
        return "text-green-500";
      case "backing_tracks":
        return "text-purple-500";
      case "all":
      default:
        return "text-muted-foreground";
    }
  };
  
  // Render appropriate icon based on category
  switch (category) {
    case "recordings":
      return <Mic className={getIconClass()} />;
    case "part_tracks":
      return <Headphones className={getIconClass()} />;
    case "my_tracks":
      return <Album className={getIconClass()} />;
    case "backing_tracks":
      return <Music className={getIconClass()} />;
    case "all":
    default:
      return <FileAudio className={getIconClass()} />;
  }
}
