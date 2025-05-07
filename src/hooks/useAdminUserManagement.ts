
import { useState } from "react";
import { User, useUserManagement } from "@/hooks/useUserManagement";
import { useMessaging } from "@/hooks/useMessaging";
import { createUser, deleteUser, updateUser } from "@/utils/admin";
import { toast } from "sonner";
import { UserFormValues } from "@/components/members/form/userFormSchema";

export function useAdminUserManagement() {
  const { sendEmail } = useMessaging();
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    fetchUsers,
    changeUserRole,
    changeUserStatus
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

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Send welcome email to new users
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
      toast.error("User created, but welcome email could not be sent");
    }
  };

  // Handle create user submission
  const handleCreateUser = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Creating user with data:", data);
      
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
      });
      
      if (result.success) {
        // Send welcome email with password reset instructions
        await sendWelcomeEmail(data.email, data.first_name, tempPassword);
        
        toast.success(`User ${data.email} created successfully. Welcome email sent.`);
        
        // Refresh the user list
        fetchUsers();
        setIsCreateUserOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit user submission
  const handleEditUser = async (data: UserFormValues) => {
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
      
      const result = await deleteUser(userToDelete.id);
      
      if (result.success) {
        toast.success(`User ${userToDelete.email} deleted successfully`);
        fetchUsers();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit user dialog
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  // Open delete user dialog
  const openDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    users,
    filteredUsers,
    selectedUser,
    isLoading,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isCreateUserOpen,
    setIsCreateUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    fetchUsers,
    formatDate,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    openEditUserDialog,
    openDeleteUserDialog,
    changeUserRole,
    changeUserStatus,
    filterUsers
  };
}
