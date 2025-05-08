
import React from "react";
import { 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AudioPageCategory } from "@/types/audio";
import { FileMusic } from "lucide-react";
import { AdvancedSearch, SearchResultItem } from "@/components/ui/advanced-search";

interface AudioFile {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  created_at: string;
}

interface AudioSearchItem extends SearchResultItem {
  category: string;
  file_url: string;
}

interface AudioSearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: AudioPageCategory;
  setActiveCategory: (category: AudioPageCategory) => void;
  audioFiles?: AudioFile[];
  onItemSelect?: (item: AudioSearchItem) => void;
}

export function AudioSearchAndFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  audioFiles = [],
  onItemSelect
}: AudioSearchAndFilterProps) {
  // Convert audio files to search items
  const audioFilesToSearchItems = (): AudioSearchItem[] => {
    return audioFiles.map(file => ({
      id: file.id,
      title: file.title,
      description: file.description,
      category: getCategoryDisplayName(file.category as AudioPageCategory),
      date: file.created_at,
      file_url: file.file_url,
      icon: <FileMusic className="h-4 w-4 text-muted-foreground" />
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger 
            value="all" 
            onClick={() => setActiveCategory("all")}
            data-state={activeCategory === "all" ? "active" : ""}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="part_tracks" 
            onClick={() => setActiveCategory("part_tracks")}
            data-state={activeCategory === "part_tracks" ? "active" : ""}
          >
            Part Tracks
          </TabsTrigger>
          <TabsTrigger 
            value="recordings" 
            onClick={() => setActiveCategory("recordings")}
            data-state={activeCategory === "recordings" ? "active" : ""}
          >
            Recordings
          </TabsTrigger>
          <TabsTrigger 
            value="my_tracks" 
            onClick={() => setActiveCategory("my_tracks")}
            data-state={activeCategory === "my_tracks" ? "active" : ""}
          >
            My Tracks
          </TabsTrigger>
        </TabsList>
        
        <div className="relative flex-1 w-full">
          <AdvancedSearch
            placeholder="Search audio files..."
            items={audioFilesToSearchItems()}
            onItemSelect={(item) => onItemSelect?.(item as AudioSearchItem)}
            searchKeys={['title', 'description']}
            maxResults={10}
          />
        </div>
      </div>
    </div>
  );
}

function getCategoryDisplayName(category: AudioPageCategory): string {
  switch (category) {
    case "part_tracks":
      return "Part Tracks";
    case "recordings":
      return "Recordings";
    case "my_tracks":
      return "My Tracks";
    case "all":
      return "All Audio";
  }
}
