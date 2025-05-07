import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { UserFilters } from "@/components/members/UserFilters";
import { UsersTableSimple } from "@/components/members/UsersTableSimple";
import { UserDetailsSheet } from "@/components/members/UserDetailsSheet";
import { formatDate } from "@/hooks/user/userUtils";

export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    isUpdating,
    fetchUsers,
    changeUserRole,
    changeUserStatus
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  
  // Handle unauthorized access
  if (!isAdmin()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <UserX className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  // Filter users when dependencies change
  useEffect(() => {
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
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Handle role change
  const handleRoleChange = async (userId: string, role: string) => {
    await changeUserRole(userId, role);
  };
  
  // Handle status change
  const handleStatusChange = async (userId: string, status: string) => {
    await changeUserStatus(userId, status);
  };
  
  // View user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all users in the system"
        icon={<UserCog className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              onClick={fetchUsers}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          
          <UsersTableSimple
            users={filteredUsers}
            isLoading={isLoading}
            onViewDetails={handleViewUserDetails}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
            formatDate={formatDate}
          />
          
          <div className="mt-4 text-sm text-gray-500">
            Total: {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>

      <UserDetailsSheet
        user={selectedUser}
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        formatDate={formatDate}
      />
    </div>
  );
}
