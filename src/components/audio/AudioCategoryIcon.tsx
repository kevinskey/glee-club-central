
import React from "react";
import { ListMusic, AudioLines, FileAudio } from "lucide-react";
import { AudioPageCategory } from "@/types/audio";

interface AudioCategoryIconProps {
  category: AudioPageCategory;
  size?: "small" | "large";
}

export function AudioCategoryIcon({ category, size = "small" }: AudioCategoryIconProps) {
  const iconSize = size === "large" ? "h-16 w-16" : "h-4 w-4";
  
  switch (category) {
    case "part_tracks":
      return <ListMusic className={`${iconSize} text-muted-foreground`} />;
    case "recordings":
      return <AudioLines className={`${iconSize} text-muted-foreground`} />;
    case "my_tracks":
      return <FileAudio className={`${iconSize} text-muted-foreground`} />;
    case "all":
      return <FileAudio className={`${iconSize} text-muted-foreground`} />;
  }
}
