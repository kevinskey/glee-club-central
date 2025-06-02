
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProductFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  availableTags: string[];
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (inStock: boolean) => void;
}

export function ProductFilter({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagChange,
  availableTags,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange
}: ProductFilterProps) {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTagChange([]);
    onPriceRangeChange({ min: 0, max: 1000 });
    onInStockOnlyChange(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Filters
          {(searchTerm || selectedTags.length > 0 || inStockOnly) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min || ''}
              onChange={(e) => onPriceRangeChange({ 
                ...priceRange, 
                min: Number(e.target.value) || 0 
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max || ''}
              onChange={(e) => onPriceRangeChange({ 
                ...priceRange, 
                max: Number(e.target.value) || 1000 
              })}
            />
          </div>
        </div>

        {/* In Stock Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={onInStockOnlyChange}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {selectedTags.length > 0 && (
          <div>
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleTagToggle(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
