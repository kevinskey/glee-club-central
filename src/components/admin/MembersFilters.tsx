
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

interface MembersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  voicePartFilter: string;
  onVoicePartFilterChange: (value: string) => void;
  duesPaidFilter: string;
  onDuesPaidFilterChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function MembersFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  voicePartFilter,
  onVoicePartFilterChange,
  duesPaidFilter,
  onDuesPaidFilterChange,
  onClearFilters,
  activeFilterCount
}: MembersFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members by name, email, or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="section_leader">Section Leader</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>

        {/* Voice Part Filter */}
        <Select value={voicePartFilter} onValueChange={onVoicePartFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Voice Part" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Voice Parts</SelectItem>
            <SelectItem value="soprano_1">Soprano 1</SelectItem>
            <SelectItem value="soprano_2">Soprano 2</SelectItem>
            <SelectItem value="alto_1">Alto 1</SelectItem>
            <SelectItem value="alto_2">Alto 2</SelectItem>
            <SelectItem value="tenor">Tenor</SelectItem>
            <SelectItem value="bass">Bass</SelectItem>
            <SelectItem value="director">Director</SelectItem>
          </SelectContent>
        </Select>

        {/* Dues Paid Filter */}
        <Select value={duesPaidFilter} onValueChange={onDuesPaidFilterChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Dues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Dues Paid</SelectItem>
            <SelectItem value="unpaid">Dues Unpaid</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="h-9"
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {roleFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Role: {roleFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRoleFilterChange('all')}
              />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onStatusFilterChange('all')}
              />
            </Badge>
          )}
          {voicePartFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Voice: {voicePartFilter.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onVoicePartFilterChange('all')}
              />
            </Badge>
          )}
          {duesPaidFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Dues: {duesPaidFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onDuesPaidFilterChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
