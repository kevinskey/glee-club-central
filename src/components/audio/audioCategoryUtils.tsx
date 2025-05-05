
import { FileAudio, ListMusic, AudioLines } from "lucide-react";
import { ReactNode } from "react";

export type AudioCategory = "part_tracks" | "recordings" | "my_tracks";

export interface CategoryInfo {
  id: AudioCategory;
  name: string;
  description: string;
  icon: ReactNode;
}

// Get display name for category
export const getCategoryName = (category: AudioCategory): string => {
  switch (category) {
    case "part_tracks":
      return "Part Tracks";
    case "recordings":
      return "Recordings";
    case "my_tracks":
      return "My Tracks";
  }
};

// Get description for category
export const getCategoryDescription = (category: AudioCategory): string => {
  switch (category) {
    case "part_tracks":
      return "Individual vocal parts for practice";
    case "recordings":
      return "Full choir recordings and performances";
    case "my_tracks":
      return "Personal recordings and practice files";
  }
};

// Get icon for category
export const getCategoryIcon = (category: AudioCategory) => {
  switch (category) {
    case "part_tracks":
      return <ListMusic className="h-4 w-4" />;
    case "recordings":
      return <AudioLines className="h-4 w-4" />;
    case "my_tracks":
      return <FileAudio className="h-4 w-4" />;
  }
};

// Get all categories with their info
export const getCategoriesInfo = (): CategoryInfo[] => {
  return [
    {
      id: "part_tracks",
      name: getCategoryName("part_tracks"),
      description: getCategoryDescription("part_tracks"),
      icon: getCategoryIcon("part_tracks"),
    },
    {
      id: "recordings",
      name: getCategoryName("recordings"),
      description: getCategoryDescription("recordings"),
      icon: getCategoryIcon("recordings"),
    },
    {
      id: "my_tracks",
      name: getCategoryName("my_tracks"),
      description: getCategoryDescription("my_tracks"),
      icon: getCategoryIcon("my_tracks"),
    },
  ];
};
