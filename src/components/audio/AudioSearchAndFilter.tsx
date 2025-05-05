
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AudioPageCategory } from "@/types/audio";

interface AudioSearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: AudioPageCategory;
  setActiveCategory: (category: AudioPageCategory) => void;
}

export function AudioSearchAndFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory
}: AudioSearchAndFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="part_tracks">Part Tracks</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="my_tracks">My Tracks</TabsTrigger>
        </TabsList>
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audio files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
