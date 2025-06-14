
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc } from 'lucide-react';

interface AdvancedFiltersProps {
  sizeFilter: 'all' | 'small' | 'medium' | 'large';
  setSizeFilter: (value: 'all' | 'small' | 'medium' | 'large') => void;
  dateRangeFilter: 'all' | 'today' | 'week' | 'month' | 'year';
  setDateRangeFilter: (value: 'all' | 'today' | 'week' | 'month' | 'year') => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  setSortBy: (value: 'name' | 'date' | 'size' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export function AdvancedFilters({
  sizeFilter,
  setSizeFilter,
  dateRangeFilter,
  setDateRangeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: AdvancedFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>File Size</Label>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
                <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                <SelectItem value="large">Large (&gt; 10MB)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Date Range</Label>
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Sort By</Label>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
