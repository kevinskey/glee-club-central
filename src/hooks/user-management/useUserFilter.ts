
import { useState, useEffect } from "react";
import { User } from "@/hooks/useUserManagement";

export function useUserFilter(users: User[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Filter users based on search term, role and status filters
  const filterUsers = (users: User[]) => {
    const filtered = users.filter(user => {
      // Search filter
      const matchesSearch = searchTerm === "" ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === "" || user.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === "" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  };

  // Update filtered users when search or filter criteria change
  useEffect(() => {
    filterUsers(users);
  }, [users, searchTerm, roleFilter, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter, 
    setStatusFilter,
    filteredUsers,
    filterUsers
  };
}
