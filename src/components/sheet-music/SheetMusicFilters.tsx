
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterState {
  composers: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface SheetMusicFiltersProps {
  availableComposers: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const SheetMusicFilters: React.FC<SheetMusicFiltersProps> = ({
  availableComposers,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const activeFilterCount = 
    filters.composers.length + 
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0);

  const handleComposerToggle = (composer: string) => {
    const newComposers = filters.composers.includes(composer)
      ? filters.composers.filter(c => c !== composer)
      : [...filters.composers, composer];
    
    onFiltersChange({
      ...filters,
      composers: newComposers,
    });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFiltersChange({
      ...filters,
      dateRange: range,
    });
  };

  const clearComposerFilters = () => {
    onFiltersChange({
      ...filters,
      composers: [],
    });
  };

  const clearDateFilters = () => {
    onFiltersChange({
      ...filters,
      dateRange: {},
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 px-1.5 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-auto p-1 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Composer Filter */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Composer</Label>
              {filters.composers.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearComposerFilters}
                  className="h-auto p-1 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {availableComposers.map((composer) => (
                  <div key={composer} className="flex items-center space-x-2">
                    <Checkbox
                      id={`composer-${composer}`}
                      checked={filters.composers.includes(composer)}
                      onCheckedChange={() => handleComposerToggle(composer)}
                    />
                    <Label 
                      htmlFor={`composer-${composer}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {composer}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator className="my-4" />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Date Added</Label>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearDateFilters}
                  className="h-auto p-1 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange.from && !filters.dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) => handleDateRangeChange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
