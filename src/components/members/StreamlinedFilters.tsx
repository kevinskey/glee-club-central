
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { UserFilters } from '@/hooks/user/useUnifiedUserManagement';

interface StreamlinedFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  activeFilterCount: number;
}

export function StreamlinedFilters({ filters, onFiltersChange, activeFilterCount }: StreamlinedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const updateFilter = (key: keyof UserFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      role: 'all',
      status: 'all',
      voicePart: 'all',
      classYear: 'all',
      duesPaid: 'all',
      isAdmin: 'all'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm sm:text-base font-medium">Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs h-7 px-2"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs h-7 px-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">More</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6 pb-3 space-y-3">
        {/* Search - Always visible */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <Input
            placeholder="Search members..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Quick filters - Always visible on desktop, collapsible on mobile */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 ${!isExpanded ? 'hidden sm:grid' : 'grid'}`}>
          <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.voicePart} onValueChange={(value) => updateFilter('voicePart', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Voices</SelectItem>
              <SelectItem value="soprano_1">Soprano 1</SelectItem>
              <SelectItem value="soprano_2">Soprano 2</SelectItem>
              <SelectItem value="alto_1">Alto 1</SelectItem>
              <SelectItem value="alto_2">Alto 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.classYear} onValueChange={(value) => updateFilter('classYear', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced filters - Only when expanded */}
        {isExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1 border-t border-border/50">
            <Select value={filters.duesPaid} onValueChange={(value) => updateFilter('duesPaid', value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Dues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Paid</SelectItem>
                <SelectItem value="false">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.isAdmin} onValueChange={(value) => updateFilter('isAdmin', value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Admin</SelectItem>
                <SelectItem value="false">Non-Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {filters.search && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Search: "{filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}"
              </Badge>
            )}
            {filters.role !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Role: {filters.role}
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Status: {filters.status}
              </Badge>
            )}
            {filters.voicePart !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Voice: {filters.voicePart.replace('_', ' ')}
              </Badge>
            )}
            {filters.classYear !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Year: {filters.classYear}
              </Badge>
            )}
            {filters.duesPaid !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Dues: {filters.duesPaid === 'true' ? 'Paid' : 'Unpaid'}
              </Badge>
            )}
            {filters.isAdmin !== 'all' && (
              <Badge variant="outline" className="text-xs h-6 px-2">
                Admin: {filters.isAdmin === 'true' ? 'Yes' : 'No'}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
