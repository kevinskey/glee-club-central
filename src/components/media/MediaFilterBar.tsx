
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, SortAsc, SortDesc, FileType, Folder } from 'lucide-react';
import { MediaType } from '@/utils/mediaUtils';

interface MediaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMediaType: MediaType | "all";
  setSelectedMediaType: (type: MediaType | "all") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  dateFilter: "newest" | "oldest";
  setDateFilter: (filter: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
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
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
          <SelectTrigger className="w-32">
            <FileType className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {mediaTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-32">
            <Folder className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-32">
            {dateFilter === 'newest' ? <SortDesc className="h-4 w-4 mr-2" /> : <SortAsc className="h-4 w-4 mr-2" />}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
