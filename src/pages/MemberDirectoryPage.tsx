
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { MemberFilters } from "@/components/members/directory/MemberFilters";
import { MemberTable } from "@/components/members/directory/MemberTable";
import { DirectoryCountSummary } from "@/components/members/directory/DirectoryCountSummary";

export default function MemberDirectoryPage() {
  const { isAdmin } = useAuth();
  const {
    users,
    isLoading,
    fetchUsers,
    activateUser
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Filter users when dependencies change
  useEffect(() => {
    console.log("Users in MemberDirectoryPage:", users); // Debug log
    
    const filtered = users.filter(user => {
      // Search filter - check each field that might contain the search term
      const matchesSearch = searchTerm === "" || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      // Status filter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Handle activating a pending user
  const handleActivateUser = async (userId: string) => {
    try {
      await activateUser(userId);
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to activate user");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Directory"
        description="View all members and their information"
        icon={<Users className="h-6 w-6" />}
      />

      <Card className="p-6">
        <CardContent className="p-0 pt-6">
          <MemberFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onRefresh={fetchUsers}
            isLoading={isLoading}
          />
          
          <MemberTable
            filteredUsers={filteredUsers}
            isLoading={isLoading}
            handleActivateUser={handleActivateUser}
          />
          
          <DirectoryCountSummary count={filteredUsers.length} />
        </CardContent>
      </Card>
    </div>
  );
}
