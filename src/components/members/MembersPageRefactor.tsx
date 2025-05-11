
import React, { useState } from "react";
import { User } from "@/hooks/useUserManagement";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useMedia } from "@/hooks/use-mobile";
import { MembersList } from "@/components/members/MembersList";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { UserTitleManagement } from "@/components/admin/UserTitleManagement";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";

// Helper function to create a member refresh function that returns void
export const createMemberRefreshFunction = (
  fetchUsers: () => Promise<any>
): (() => Promise<void>) => {
  return async () => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Error refreshing members:", error);
    }
  };
};

// Type for the MembersPageComponent props
export interface MembersPageProps {
  useUserManagementHook: () => {
    users: User[];
    isLoading: boolean;
    fetchUsers: () => Promise<any>;
    addUser: (data: UserFormValues) => Promise<boolean>;
  };
}

export function MembersPageComponent({ useUserManagementHook }: MembersPageProps) {
  const { isAdmin, isLoading: authLoading, isAuthenticated, profile } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isManageRoleOpen, setIsManageRoleOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  
  const {
    users: allMembers,
    isLoading,
    fetchUsers,
    addUser
  } = useUserManagementHook();
  
  // Filter out deleted users
  const members = allMembers.filter(member => member.status !== 'deleted');
  
  // Create a wrapper function for fetchUsers that returns void
  const refreshUsers = createMemberRefreshFunction(fetchUsers);

  // Handle refresh after role update
  const handleRoleUpdateSuccess = async () => {
    await refreshUsers();
    toast.success("Member list refreshed");
  };
  
  // Handle adding a new member
  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name} successfully`);
        await refreshUsers();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has admin privileges
  const hasAdminAccess = isAdmin?.() || isSuperAdmin || profile?.is_super_admin || hasPermission('can_manage_users');

  console.log("AdminMembersPage - Access check:", {
    isAuthenticated,
    authLoading,
    isAdmin: isAdmin?.(),
    isSuperAdmin,
    profileSuperAdmin: profile?.is_super_admin,
    hasPermission: hasPermission('can_manage_users'),
    hasAdminAccess
  });

  // Only redirect if no admin access
  if (!authLoading && isAuthenticated && !hasAdminAccess) {
    console.log("AdminMembersPage - Access denied, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter members based on search query and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || (member.role || '') === roleFilter;
    const matchesStatus = statusFilter === "all" || (member.status || '') === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open role management dialog
  const openRoleManagement = (user: User) => {
    setSelectedUser(user);
    setIsManageRoleOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Member Management"
        description="View and manage all Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <UserManagementToolbar 
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateUserClick={() => setIsAddMemberOpen(true)}
          onRefreshClick={refreshUsers}
          isLoading={isLoading}
          isMobile={isMobile}
          canCreate={hasAdminAccess}
        />
        
        <MembersList 
          members={filteredMembers}
          onChangeRole={openRoleManagement}
        />
      </Card>
      
      {/* Role Management Dialog */}
      <UserTitleManagement
        user={selectedUser}
        isOpen={isManageRoleOpen}
        setIsOpen={setIsManageRoleOpen}
        onSuccess={handleRoleUpdateSuccess}
      />
      
      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
