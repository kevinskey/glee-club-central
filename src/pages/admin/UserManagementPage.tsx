
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Plus, Search, Filter, UserCog, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { UserRoleSelector } from "@/components/members/UserRoleSelector";
import { User, useUserManagement } from "@/hooks/useUserManagement";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { EditUserDialog } from "@/components/members/EditUserDialog";

interface UserManagementState {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  selectedUser: User | null;
  isRoleDialogOpen: boolean;
  isAddUserDialogOpen: boolean;
  isEditUserDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isSubmitting: boolean;
  userToDelete: string | null;
  userToDeleteName: string;
  isDeleting: boolean;
}

export default function UserManagementPage() {
  const { 
    addUser, 
    fetchUsers, 
    updateUser, 
    deleteUser 
  } = useUserManagement();
  
  const [state, setState] = useState<UserManagementState>({
    users: [],
    isLoading: true,
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all",
    selectedUser: null,
    isRoleDialogOpen: false,
    isAddUserDialogOpen: false,
    isEditUserDialogOpen: false,
    isDeleteDialogOpen: false,
    isSubmitting: false,
    userToDelete: null,
    userToDeleteName: "",
    isDeleting: false
  });
  
  // Fetch users
  const loadUsers = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setState(prev => ({ ...prev, users: data as User[] }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search query and filters
  const filteredUsers = state.users.filter(user => {
    const matchesSearch = 
      (user.first_name || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const matchesRole = state.roleFilter === "all" || user.role === state.roleFilter;
    const matchesStatus = state.statusFilter === "all" || user.status === state.statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handler for adding a new user by admin
  const handleAddUser = async (values: UserFormValues) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    try {
      const success = await addUser(values);
      if (success) {
        toast.success(`Added ${values.first_name} ${values.last_name}`);
        setState(prev => ({ 
          ...prev, 
          isAddUserDialogOpen: false,
          isSubmitting: false 
        }));
        loadUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handler for updating a user
  const handleUpdateUser = async (data: UserFormValues) => {
    if (!state.selectedUser) return;
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    try {
      const success = await updateUser(state.selectedUser.id, data);
      if (success) {
        setState(prev => ({ 
          ...prev, 
          isEditUserDialogOpen: false,
          selectedUser: null,
          isSubmitting: false
        }));
        toast.success(`Updated ${data.first_name} ${data.last_name}`);
        await loadUsers(); // Refresh the list after update
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Open edit dialog for a user
  const handleEditUser = (user: User) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      isEditUserDialogOpen: true
    }));
  };

  // Change user role
  const openRoleDialog = (user: User) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      isRoleDialogOpen: true
    }));
  };

  // Change user status
  const changeUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`User status updated to ${newStatus}`);
      await loadUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Delete user
  const handleDeleteClick = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      setState(prev => ({
        ...prev,
        userToDelete: userId,
        userToDeleteName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'this user',
        isDeleteDialogOpen: true
      }));
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!state.userToDelete) return;
    
    setState(prev => ({ ...prev, isDeleting: true }));
    try {
      const success = await deleteUser(state.userToDelete);
      if (success) {
        setState(prev => ({ 
          ...prev, 
          isDeleteDialogOpen: false,
          userToDelete: null,
          isDeleting: false
        }));
        toast.success(`${state.userToDeleteName} has been removed`);
        await loadUsers(); // Refresh user list
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      setState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Format last login time
  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never";
    try {
      return formatDistanceToNow(new Date(lastLogin), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage all users"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
          <div className="flex flex-1 gap-2 items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="max-w-sm"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <select
              className="border rounded p-2 text-sm"
              value={state.roleFilter}
              onChange={(e) => setState(prev => ({ ...prev, roleFilter: e.target.value }))}
            >
              <option value="all">All Roles</option>
              <option value="administrator">Administrator</option>
              <option value="section_leader">Section Leader</option>
              <option value="singer">Singer</option>
              <option value="student_conductor">Student Conductor</option>
              <option value="accompanist">Accompanist</option>
              <option value="non_singer">Non-Singer</option>
            </select>
            
            <select
              className="border rounded p-2 text-sm"
              value={state.statusFilter}
              onChange={(e) => setState(prev => ({ ...prev, statusFilter: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
            </select>
            
            <Button variant="outline" onClick={loadUsers}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={() => setState(prev => ({ ...prev, isAddUserDialogOpen: true }))}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'administrator' ? "default" : "outline"}
                      >
                        {user.role === 'administrator' ? 'Administrator' : user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'active' ? "success" : "secondary"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatLastLogin(user.last_login)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, 'active')}>
                            Set as Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, 'pending')}>
                            Set as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, 'inactive')}>
                            Set as Inactive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, 'alumni')}>
                            Set as Alumni
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleDeleteClick(user.id)}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* User Role Dialog */}
      <UserRoleSelector
        user={state.selectedUser}
        isOpen={state.isRoleDialogOpen}
        onOpenChange={(isOpen) => setState(prev => ({ ...prev, isRoleDialogOpen: isOpen }))}
        onSuccess={loadUsers}
      />

      {/* Add User Dialog */}
      <AddMemberDialog
        isOpen={state.isAddUserDialogOpen}
        onOpenChange={(open) => setState(prev => ({ ...prev, isAddUserDialogOpen: open }))}
        onMemberAdd={handleAddUser}
        isSubmitting={state.isSubmitting}
      />
      
      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={state.isEditUserDialogOpen}
        onOpenChange={(open) => setState(prev => ({ ...prev, isEditUserDialogOpen: open }))}
        onSave={handleUpdateUser}
        isSubmitting={state.isSubmitting}
        user={state.selectedUser}
      />
      
      {/* Delete User Dialog */}
      <DeleteMemberDialog
        isOpen={state.isDeleteDialogOpen}
        onOpenChange={(open) => setState(prev => ({ ...prev, isDeleteDialogOpen: open }))}
        onConfirm={handleConfirmDelete}
        memberName={state.userToDeleteName}
        isDeleting={state.isDeleting}
      />
    </div>
  );
}
