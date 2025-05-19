
import React from "react";
import { Search, Filter, Calendar, Grid, List, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaType, getMediaTypeLabel } from "@/utils/mediaUtils";

interface MediaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMediaType: MediaType | "all";
  setSelectedMediaType: (type: MediaType | "all") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  dateFilter: "newest" | "oldest";
  setDateFilter: (filter: string) => void;
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
  categories,
}: MediaFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-2 bg-muted/30 rounded-md">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={selectedMediaType} onValueChange={(value) => setSelectedMediaType(value as MediaType | "all")}>
          <SelectTrigger className="w-32">
            <div className="flex items-center gap-2">
              <FileType className="h-4 w-4" />
              <SelectValue placeholder="File Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {mediaTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getMediaTypeLabel(type as MediaType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-32">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-32">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Date" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1">
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
    </div>
  );
}
