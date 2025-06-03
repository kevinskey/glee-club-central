
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface MemberFilters {
  search: string;
  role: string;
  status: string;
  voicePart: string;
  classYear: string;
  duesPaid: string;
  isAdmin: string;
}

interface MemberFiltersAdvancedProps {
  filters: MemberFilters;
  onFiltersChange: (filters: MemberFilters) => void;
  activeFilterCount: number;
}

export function MemberFiltersAdvanced({
  filters,
  onFiltersChange,
  activeFilterCount
}: MemberFiltersAdvancedProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const updateFilter = (key: keyof MemberFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
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

  const getActiveFilters = () => {
    const active = [];
    if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters.role !== 'all') active.push({ key: 'role', label: `Role: ${filters.role}` });
    if (filters.status !== 'all') active.push({ key: 'status', label: `Status: ${filters.status}` });
    if (filters.voicePart !== 'all') active.push({ key: 'voicePart', label: `Voice: ${filters.voicePart.replace('_', ' ')}` });
    if (filters.classYear !== 'all') active.push({ key: 'classYear', label: `Class: ${filters.classYear}` });
    if (filters.duesPaid !== 'all') active.push({ key: 'duesPaid', label: `Dues: ${filters.duesPaid === 'true' ? 'Paid' : 'Unpaid'}` });
    if (filters.isAdmin !== 'all') active.push({ key: 'isAdmin', label: `Admin: ${filters.isAdmin === 'true' ? 'Yes' : 'No'}` });
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Filter Members</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {isExpanded ? 'Hide' : 'Show'} Filters
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search - Always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or notes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="text-xs">
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => {
                    if (filter.key === 'search') {
                      updateFilter('search', '');
                    } else {
                      updateFilter(filter.key as keyof MemberFilters, 'all');
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Collapsible Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Role Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="section_leader">Section Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Part Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Voice Part</label>
                <Select value={filters.voicePart} onValueChange={(value) => updateFilter('voicePart', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Voice Parts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Voice Parts</SelectItem>
                    <SelectItem value="soprano_1">Soprano 1</SelectItem>
                    <SelectItem value="soprano_2">Soprano 2</SelectItem>
                    <SelectItem value="alto_1">Alto 1</SelectItem>
                    <SelectItem value="alto_2">Alto 2</SelectItem>
                    <SelectItem value="tenor">Tenor</SelectItem>
                    <SelectItem value="bass">Bass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Class Year Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Class Year</label>
                <Select value={filters.classYear} onValueChange={(value) => updateFilter('classYear', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dues Paid Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Dues Status</label>
                <Select value={filters.duesPaid} onValueChange={(value) => updateFilter('duesPaid', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Paid</SelectItem>
                    <SelectItem value="false">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Status Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Admin Status</label>
                <Select value={filters.isAdmin} onValueChange={(value) => updateFilter('isAdmin', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Admin</SelectItem>
                    <SelectItem value="false">Non-Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
