
import { useState, useMemo } from 'react';

interface FilterState {
  search: string;
  roleFilter: string;
  statusFilter: string;
  voicePartFilter: string;
  duesPaidFilter: string;
}

interface Member {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  status?: string;
  voice_part?: string;
  dues_paid?: boolean;
  notes?: string;
}

export function useMembersFiltering(members: Member[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    roleFilter: 'all',
    statusFilter: 'all',
    voicePartFilter: 'all',
    duesPaidFilter: 'all'
  });

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const email = (member.email || '').toLowerCase();
        const notes = (member.notes || '').toLowerCase();
        
        const matchesSearch = fullName.includes(searchTerm) || 
                             email.includes(searchTerm) || 
                             notes.includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Role filter
      if (filters.roleFilter !== 'all' && member.role !== filters.roleFilter) {
        return false;
      }

      // Status filter
      if (filters.statusFilter !== 'all' && member.status !== filters.statusFilter) {
        return false;
      }

      // Voice part filter
      if (filters.voicePartFilter !== 'all' && member.voice_part !== filters.voicePartFilter) {
        return false;
      }

      // Dues paid filter
      if (filters.duesPaidFilter !== 'all') {
        const isDuesPaid = member.dues_paid === true;
        if (filters.duesPaidFilter === 'paid' && !isDuesPaid) return false;
        if (filters.duesPaidFilter === 'unpaid' && isDuesPaid) return false;
      }

      return true;
    });
  }, [members, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.roleFilter !== 'all') count++;
    if (filters.statusFilter !== 'all') count++;
    if (filters.voicePartFilter !== 'all') count++;
    if (filters.duesPaidFilter !== 'all') count++;
    return count;
  }, [filters]);

  const updateSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const updateRoleFilter = (roleFilter: string) => {
    setFilters(prev => ({ ...prev, roleFilter }));
  };

  const updateStatusFilter = (statusFilter: string) => {
    setFilters(prev => ({ ...prev, statusFilter }));
  };

  const updateVoicePartFilter = (voicePartFilter: string) => {
    setFilters(prev => ({ ...prev, voicePartFilter }));
  };

  const updateDuesPaidFilter = (duesPaidFilter: string) => {
    setFilters(prev => ({ ...prev, duesPaidFilter }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      roleFilter: 'all',
      statusFilter: 'all',
      voicePartFilter: 'all',
      duesPaidFilter: 'all'
    });
  };

  return {
    filters,
    filteredMembers,
    activeFilterCount,
    updateSearch,
    updateRoleFilter,
    updateStatusFilter,
    updateVoicePartFilter,
    updateDuesPaidFilter,
    clearFilters
  };
}
