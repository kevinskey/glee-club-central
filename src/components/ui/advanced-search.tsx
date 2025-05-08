
import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Fuse from 'fuse.js';

// Type for each search result item
export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  url?: string;
  icon?: React.ReactNode;
}

// Type for search filters
export interface SearchFilter<T extends string = string> {
  id: string;
  label: string;
  type: 'category' | 'tag' | 'date' | 'checkbox';
  options?: Array<{
    value: T;
    label: string;
  }>;
}

interface AdvancedSearchProps<T extends SearchResultItem> {
  placeholder?: string;
  items: T[];
  filters?: SearchFilter[];
  onSearch?: (results: T[]) => void;
  onItemSelect?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  maxResults?: number;
  searchKeys?: string[];
  highlightMatchedText?: boolean;
}

export function AdvancedSearch<T extends SearchResultItem>({
  placeholder = "Search...",
  items,
  filters = [],
  onSearch,
  onItemSelect,
  emptyMessage = "No results found.",
  className,
  maxResults = 10,
  searchKeys = ['title', 'description'],
  highlightMatchedText = true,
}: AdvancedSearchProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [results, setResults] = useState<T[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize fuse for fuzzy search
  const fuseOptions = {
    keys: searchKeys,
    threshold: 0.3,
    includeMatches: highlightMatchedText,
    ignoreLocation: true,
  };
  const fuse = new Fuse(items, fuseOptions);

  // Handle search query changes
  useEffect(() => {
    if (!query) {
      // If no query, show results filtered by active filters only
      const filteredResults = applyFilters(items, activeFilters);
      setResults(filteredResults.slice(0, maxResults));
      onSearch?.(filteredResults);
      return;
    }
    
    // Search with fuse.js (fuzzy search)
    const searchResults = fuse.search(query);
    
    // Apply any active filters to search results
    const filteredResults = applyFilters(
      searchResults.map(result => result.item), 
      activeFilters
    );
    
    setResults(filteredResults.slice(0, maxResults));
    onSearch?.(filteredResults);
  }, [query, items, activeFilters]);

  // Apply filters to results
  const applyFilters = (items: T[], filters: Record<string, any>): T[] => {
    if (Object.keys(filters).length === 0) return items;
    
    return items.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          // For multi-select filters
          if (!item[key as keyof T]) return false;
          
          // If array field in item, check if any selected values match
          if (Array.isArray(item[key as keyof T])) {
            const itemValues = item[key as keyof T] as any[];
            if (value.length > 0 && !value.some(v => itemValues.includes(v))) {
              return false;
            }
          } else {
            // For single value fields, check if item value is in the selected options
            if (value.length > 0 && !value.includes(item[key as keyof T])) {
              return false;
            }
          }
        } else if (value !== undefined && value !== null) {
          // For single select filters
          if (item[key as keyof T] !== value) return false;
        }
      }
      return true;
    });
  };

  // Toggle filter value
  const toggleFilter = (filterId: string, value: any) => {
    setActiveFilters(prev => {
      const filter = filters?.find(f => f.id === filterId);
      
      // Handle different filter types
      if (filter?.type === 'checkbox') {
        const currentValues = prev[filterId] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
          
        return {
          ...prev,
          [filterId]: newValues.length > 0 ? newValues : undefined
        };
      }
      
      return {
        ...prev,
        [filterId]: prev[filterId] === value ? undefined : value
      };
    });
  };

  // Handle item selection
  const handleSelect = (item: T) => {
    onItemSelect?.(item);
    setOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
  };

  // Highlight matched text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query || !highlightMatchedText || !text) return text;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <>
          {parts.map((part, i) => 
            regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(
    value => value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start py-5 h-auto pl-9 font-normal"
            >
              {query || placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder={placeholder} 
                value={query}
                onValueChange={setQuery}
                ref={inputRef}
                className="h-9"
              />
              
              {filters.length > 0 && (
                <div className="border-t p-2 flex flex-wrap gap-2 items-center">
                  {activeFilterCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-7 text-xs"
                    >
                      Clear all filters
                    </Button>
                  )}
                  
                  {filters.map(filter => (
                    <Popover key={filter.id}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-7 text-xs",
                            activeFilters[filter.id] && "bg-muted"
                          )}
                        >
                          {filter.label}
                          <ChevronDown className="ml-1 h-3 w-3" />
                          {activeFilters[filter.id] && (
                            <Badge 
                              variant="purple" 
                              className="ml-1 h-4 px-1 text-[10px]"
                            >
                              {Array.isArray(activeFilters[filter.id]) 
                                ? activeFilters[filter.id].length 
                                : "1"}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-2" side="bottom">
                        {filter.options && filter.options.length > 0 && (
                          <ScrollArea className="max-h-72">
                            <div className="space-y-1">
                              {filter.options.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-2 p-1 hover:bg-muted rounded"
                                >
                                  <Checkbox
                                    id={`${filter.id}-${option.value}`}
                                    checked={
                                      Array.isArray(activeFilters[filter.id])
                                        ? activeFilters[filter.id]?.includes(option.value)
                                        : activeFilters[filter.id] === option.value
                                    }
                                    onCheckedChange={() => toggleFilter(filter.id, option.value)}
                                  />
                                  <label
                                    htmlFor={`${filter.id}-${option.value}`}
                                    className="text-sm cursor-pointer flex-grow"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              )}

              <CommandList>
                {results.length > 0 ? (
                  <CommandGroup heading="Results">
                    <ScrollArea className="max-h-72">
                      {results.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => handleSelect(item)}
                          className="flex items-center gap-2 py-3"
                        >
                          {item.icon && (
                            <div className="flex-shrink-0">
                              {item.icon}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {highlightMatch(item.title, query)}
                            </div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {highlightMatch(item.description, query)}
                              </div>
                            )}
                            {item.category && (
                              <Badge className="mt-1 w-fit" variant="outline">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                ) : (
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery("")}
            className="absolute right-1 h-full px-3 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}
