
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw } from 'lucide-react';
import { UserFilters } from '@/hooks/user/useUnifiedUserManagement';

interface StreamlinedFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  activeFilterCount: number;
}

export function StreamlinedFilters({ filters, onFiltersChange, activeFilterCount }: StreamlinedFiltersProps) {
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
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or notes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.voicePart} onValueChange={(value) => updateFilter('voicePart', value)}>
            <SelectTrigger>
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
            <SelectTrigger>
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

          <Select value={filters.duesPaid} onValueChange={(value) => updateFilter('duesPaid', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Dues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Paid</SelectItem>
              <SelectItem value="false">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.isAdmin} onValueChange={(value) => updateFilter('isAdmin', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Admin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Admin</SelectItem>
              <SelectItem value="false">Non-Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
