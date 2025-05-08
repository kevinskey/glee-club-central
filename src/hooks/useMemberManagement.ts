
import { useState, useEffect, useCallback } from "react";
import { fetchMembers } from "@/utils/supabase/members";
import { updateUserStatus } from "@/utils/supabase/users";
import { toast } from "sonner";
import { Profile, UserRole, MemberStatus, VoicePart } from "@/contexts/AuthContext";

export type Member = Profile & {
  id: string;
  email?: string | null;
  class_year?: string | null;
  dues_paid?: boolean | null;
  notes?: string | null;
}

export function useMemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10
  });
  
  // Fetch all members
  const fetchAllMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMembers();
      console.log("Fetched members:", data);
      setMembers(data as Member[]);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchAllMembers();
  }, [fetchAllMembers]);
  
  // Filter, sort, and paginate members
  useEffect(() => {
    let result = [...members];
    
    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(member => 
        member.first_name?.toLowerCase().includes(lowerSearch) ||
        member.last_name?.toLowerCase().includes(lowerSearch) ||
        member.email?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(member => member.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(member => member.status === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by last name
      result.sort((a, b) => {
        if (!a.last_name) return 1;
        if (!b.last_name) return -1;
        return a.last_name.localeCompare(b.last_name || '');
      });
    }
    
    // Update filtered members
    setFilteredMembers(result);
  }, [members, searchTerm, roleFilter, statusFilter, sortConfig]);
  
  // Activate a pending user
  const activateMember = async (userId: string) => {
    try {
      const success = await updateUserStatus(userId, 'active');
      if (success) {
        // Update the local state
        setMembers(prev => 
          prev.map(member => 
            member.id === userId ? { ...member, status: 'active' as MemberStatus } : member
          )
        );
        return true;
      } else {
        throw new Error("Failed to activate user");
      }
    } catch (error) {
      console.error("Error activating user:", error);
      throw error;
    }
  };

  return {
    members,
    filteredMembers,
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    pagination,
    setPagination,
    refreshMembers: fetchAllMembers,
    activateMember
  };
}
