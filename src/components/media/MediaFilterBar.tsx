
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
  showAdvancedFilters?: boolean;
  setShowAdvancedFilters?: (show: boolean) => void;
}

export function MediaFilterBar({
  searchQuery,
  setSearchQuery,
  selectedMediaType,
  setSelectedMediaType,
  showAdvancedFilters,
  setShowAdvancedFilters
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
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="pdf">Documents</SelectItem>
          </SelectContent>
        </Select>

        {setShowAdvancedFilters && (
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}
