
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFSearchBarProps {
  searchTerm: string;
  searchResults: any[];
  currentSearchIndex: number;
  onSearchChange: (term: string) => void;
  onPrevResult: () => void;
  onNextResult: () => void;
}

export const PDFSearchBar: React.FC<PDFSearchBarProps> = ({
  searchTerm,
  searchResults,
  currentSearchIndex,
  onSearchChange,
  onPrevResult,
  onNextResult
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30 h-10">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-7 h-6 text-xs"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {currentSearchIndex + 1}/{searchResults.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onPrevResult}
            disabled={currentSearchIndex <= 0}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onNextResult}
            disabled={currentSearchIndex >= searchResults.length - 1}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
