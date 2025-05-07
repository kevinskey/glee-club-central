
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { useMessaging } from "@/hooks/useMessaging";
import { createUser, deleteUser, updateUser } from "@/utils/adminUserOperations";
import { UserFilters } from "@/components/members/UserFilters";
import { UsersTable } from "@/components/members/UsersTable";
import { CreateUserForm } from "@/components/members/CreateUserForm";
import { EditUserForm } from "@/components/members/EditUserForm";
import { DeleteUserDialog } from "@/components/members/DeleteUserDialog";

export default function AdminUserManagementPage() {
  const { isAdmin } = useAuth();
  const { sendEmail } = useMessaging();
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    fetchUsers,
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle unauthorized access
  if (!isAdmin()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <UserCog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access this page.</p>
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

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handle create user form submission
  const onCreateUserSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Generate a temporary random password if not provided
      const tempPassword = data.password || Math.random().toString(36).slice(-8);
      
      // Create the user in Supabase
      const result = await createUser({
        email: data.email,
        password: tempPassword,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part || null,
        phone: data.phone || null,
        section_id: data.section_id || null,
      });
      
      if (result.success) {
        // Send welcome email with password reset instructions
        await sendWelcomeEmail(data.email, data.first_name, tempPassword);
        
        toast.success(`User ${data.email} created successfully. Welcome email sent.`);
        
        // Refresh the user list
        fetchUsers();
      }
      
      setIsCreateUserOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send welcome email to the new user
  const sendWelcomeEmail = async (email: string, firstName: string, tempPassword: string) => {
    try {
      const emailContent = `
        <h2>Welcome to the Spelman College Glee Club!</h2>
        <p>Dear ${firstName},</p>
        <p>You have been added as a member to the Spelman College Glee Club system. To get started, please login using the following temporary password:</p>
        <p><strong>${tempPassword}</strong></p>
        <p>For security reasons, please change your password immediately after your first login.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Best regards,<br>Spelman College Glee Club</p>
      `;
      
      await sendEmail(email, "Welcome to Spelman College Glee Club", emailContent);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // We don't want to stop the flow if email fails, so just log it
      toast.error("User created, but welcome email could not be sent");
    }
  };

  // Handle edit user form submission
  const onEditUserSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (!selectedUser) return;
      
      // Update user data
      const updateData: any = {
        id: selectedUser.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part,
        phone: data.phone,
        section_id: data.section_id,
      };
      
      // Add password only if provided
      if (data.password) {
        updateData.password = data.password;
      }
      
      const result = await updateUser(updateData);
      
      if (result.success) {
        toast.success(`User ${selectedUser.email} updated successfully`);
        fetchUsers(); // Refresh user list
        setIsEditUserOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Error updating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      if (!userToDelete) return;
      
      // Call the deleteUser function
      const result = await deleteUser(userToDelete.id);
      
      if (result.success) {
        toast.success(`User ${userToDelete.email} deleted successfully`);
        fetchUsers(); // Refresh the user list
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  // Delete user click
  const handleDeleteUserClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Create, edit, and manage users with advanced controls"
        icon={<UserCog className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <UserFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsCreateUserOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button
                variant="outline"
                onClick={fetchUsers}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          <UsersTable 
            users={filteredUsers}
            isLoading={isLoading}
            handleEditUser={handleEditUser}
            handleDeleteUserClick={handleDeleteUserClick}
            formatDate={formatDate}
          />
          
          <div className="mt-4 text-sm text-gray-500">
            Total: {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>

      {/* Create User Sheet */}
      <Sheet open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New User</SheetTitle>
            <SheetDescription>
              Create a new user account. All users will receive an email invitation.
            </SheetDescription>
          </SheetHeader>
          
          <CreateUserForm onSubmit={onCreateUserSubmit} isSubmitting={isSubmitting} />
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information and permissions
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <EditUserForm 
              user={selectedUser}
              onSubmit={onEditUserSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <DeleteUserDialog 
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteConfirm={handleDeleteUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
