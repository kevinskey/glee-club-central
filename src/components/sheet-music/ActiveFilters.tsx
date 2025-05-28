
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { FilterState } from "./SheetMusicFilters";

interface ActiveFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = 
    filters.composers.length > 0 || 
    filters.dateRange.from || 
    filters.dateRange.to;

  if (!hasActiveFilters) return null;

  const removeComposer = (composer: string) => {
    onFiltersChange({
      ...filters,
      composers: filters.composers.filter(c => c !== composer),
    });
  };

  const removeDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: {},
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {/* Composer filters */}
      {filters.composers.map((composer) => (
        <Badge key={composer} variant="secondary" className="gap-1">
          <span className="text-xs">Composer: {composer}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-auto p-0 hover:bg-transparent"
            onClick={() => removeComposer(composer)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {/* Date range filter */}
      {(filters.dateRange.from || filters.dateRange.to) && (
        <Badge variant="secondary" className="gap-1">
          <span className="text-xs">
            Date: {filters.dateRange.from && format(filters.dateRange.from, "MMM dd")}
            {filters.dateRange.from && filters.dateRange.to && " - "}
            {filters.dateRange.to && format(filters.dateRange.to, "MMM dd")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-auto p-0 hover:bg-transparent"
            onClick={removeDateRange}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearFilters}
        className="ml-auto text-xs h-6"
      >
        Clear all
      </Button>
    </div>
  );
};
