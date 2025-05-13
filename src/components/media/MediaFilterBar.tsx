
import React from "react";
import { FilterIcon, SortIcon, Calendar, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/utils/mediaUtils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MediaTypeDropdown } from "./MediaTypeDropdown";

interface MediaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMediaType: MediaType | "all";
  setSelectedMediaType: (type: MediaType | "all") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  dateFilter: "newest" | "oldest";
  setDateFilter: (filter: "newest" | "oldest") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  mediaTypes: MediaType[];
  categories: string[];
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
  mediaTypes,
  categories
}: MediaFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Media Type Dropdown */}
      <MediaTypeDropdown 
        selected={selectedMediaType}
        onSelect={setSelectedMediaType}
      />
      
      {/* Category Selection */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Date Sort */}
      <Select value={dateFilter} onValueChange={setDateFilter as any}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>
      
      {/* View Toggle */}
      <div className="flex gap-1 ml-auto">
        <Button 
          variant={viewMode === "list" ? "default" : "outline"} 
          size="icon" 
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant={viewMode === "grid" ? "default" : "outline"} 
          size="icon" 
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
