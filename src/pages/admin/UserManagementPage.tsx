
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { User, userManagementService } from "@/services/userManagement";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { MembersList } from "@/components/members/MembersList";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { EditUserDialog } from "@/components/members/EditUserDialog";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { UserRoleSelector } from "@/components/members/UserRoleSelector";
import { MemberPermissionsDialog } from "@/components/members/MemberPermissionsDialog";
import { useMedia } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserManagementPage() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState("");
  
  const isMobile = useMedia('(max-width: 640px)');

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Apply filters when users, search query, or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);
  
  // Fetch users from the service
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter users based on search and filters
  const filterUsers = () => {
    const filtered = users.filter(user => {
      const matchesSearch = 
        !searchQuery ||
        (user.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus && user.status !== 'deleted';
    });
    
    setFilteredUsers(filtered);
  };
  
  // Handle adding a new user
  const handleAddUser = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const success = await userManagementService.createUser(formData);
      if (success) {
        setIsAddUserDialogOpen(false);
        await fetchUsers();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle editing a user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  // Handle updating a user
  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const success = await userManagementService.updateUser(selectedUser.id, data);
      if (success) {
        setIsEditUserDialogOpen(false);
        setSelectedUser(null);
        await fetchUsers();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle changing user role
  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };
  
  // Handle role change success
  const handleRoleChangeSuccess = async () => {
    await fetchUsers();
  };
  
  // Handle managing permissions
  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };
  
  // Handle deleting a user
  const handleDeleteClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(userId);
      setUserToDeleteName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'this user');
      setIsDeleteDialogOpen(true);
    }
  };
  
  // Handle confirming user deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await userManagementService.deleteUser(userToDelete);
      if (success) {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        await fetchUsers();
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="User Management"
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
          onCreateUserClick={() => setIsAddUserDialogOpen(true)}
          onRefreshClick={fetchUsers}
          isLoading={isLoading}
          isMobile={isMobile}
          canCreate={true}
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <MembersList
            members={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteClick}
            onManagePermissions={handleManagePermissions}
            onChangeRole={handleChangeRole}
            canEdit={true}
          />
        )}
      </Card>
      
      {/* Add User Dialog */}
      <AddMemberDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onMemberAdd={handleAddUser}
        isSubmitting={isSubmitting}
      />
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <EditUserDialog
          isOpen={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onSave={handleUpdateUser}
          isSubmitting={isSubmitting}
          user={selectedUser}
        />
      )}
      
      {/* Delete User Dialog */}
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        memberName={userToDeleteName}
        isDeleting={isDeleting}
      />
      
      {/* Role Selection Dialog */}
      <UserRoleSelector
        user={selectedUser}
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        onSuccess={handleRoleChangeSuccess}
      />
      
      {/* Permissions Dialog */}
      <MemberPermissionsDialog
        user={selectedUser}
        isOpen={isPermissionsDialogOpen}
        setIsOpen={setIsPermissionsDialogOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
