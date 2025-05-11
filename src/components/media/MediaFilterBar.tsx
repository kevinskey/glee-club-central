
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/utils/mediaUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { Grid, List } from "lucide-react";

interface MediaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMediaType: MediaType | "all";
  setSelectedMediaType: (type: MediaType | "all") => void;
  selectedCategory: string | "all";
  setSelectedCategory: (category: string | "all") => void;
  dateFilter: "newest" | "oldest";
  setDateFilter: (filter: "newest" | "oldest") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  categories: string[];
  mediaTypes: MediaType[];
}

export function MediaFilterBar({
  searchQuery,
  setSearchQuery,
  selectedMediaType,
  setSelectedMediaType,
  selectedCategory,
  setSelectedCategory,
  dateFilter,
  setDateFilter,
  viewMode,
  setViewMode,
  categories,
  mediaTypes
}: MediaFilterBarProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:flex gap-2">
          {/* Media Type Filter */}
          <Select value={selectedMediaType} onValueChange={(value) => setSelectedMediaType(value as MediaType | "all")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {mediaTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "pdf" ? "Documents" : 
                   type === "audio" ? "Audio" :
                   type === "image" ? "Images" :
                   type === "video" ? "Videos" : "Other"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as "newest" | "oldest")}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="md:ml-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
