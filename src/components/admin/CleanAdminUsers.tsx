import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Plus, 
  Upload, 
  RefreshCw, 
  AlertCircle,
  UserPlus
} from "lucide-react";
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { UserListCore } from '@/components/members/UserListCore';
import { StreamlinedFilters } from '@/components/members/StreamlinedFilters';
import { MembersPagination } from '@/components/members/MembersPagination';
import { EditUserDialog } from '@/components/members/EditUserDialog';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';

const CleanAdminUsers: React.FC = () => {
  console.log('🔧 CleanAdminUsers: Component rendering started');
  
  const { isAdmin } = useAuthMigration();
  const {
    filteredUsers,
    isLoading,
    error,
    filters,
    currentPage,
    totalPages,
    paginatedUsers,
    setFilters,
    setCurrentPage,
    refetch,
    addUser,
    updateUser
  } = useUnifiedUserManagement();

  console.log('🔧 CleanAdminUsers: Data state:', {
    filteredUsersCount: filteredUsers.length,
    paginatedUsersCount: paginatedUsers.length,
    isLoading,
    error,
    currentPage,
    totalPages
  });

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdminUser = isAdmin();

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    return value !== 'all';
  }).length;

  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setShowAddMemberDialog(false);
        toast.success('Member added successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleSaveUser = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const updateData: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        voice_part: data.voice_part,
        status: data.status,
        class_year: data.class_year,
        notes: data.notes,
        dues_paid: data.dues_paid,
        is_super_admin: data.is_admin,
        role: data.is_admin ? 'admin' : 'member'
      };

      const success = await updateUser(selectedUser.id, updateData);
      if (success) {
        setShowEditDialog(false);
        setSelectedUser(null);
        toast.success('User updated successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    console.log('Delete user:', userId);
  };

  if (isLoading) {
    console.log('🔄 CleanAdminUsers: Showing loading state');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  console.log('🔧 CleanAdminUsers: Rendering main UI with', filteredUsers.length, 'filtered users');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="User Management"
        description={`Manage Glee Club members and their roles (${filteredUsers.length} total members)`}
        icon={<Users className="h-6 w-6" />}
      />

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading members: {error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members Directory</CardTitle>
          <div className="flex gap-2">
            <Button onClick={refetch} variant="outline" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowAddMemberDialog(true)} variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/csv-upload">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StreamlinedFilters
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 mb-4">
            <p>
              Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, filteredUsers.length)} of {filteredUsers.length} members
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
            </p>
            <p>Page {currentPage} of {totalPages}</p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Members Found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilterCount > 0 ? 'No members match your current filters.' : 'No members have been added yet.'}
              </p>
              {activeFilterCount === 0 && (
                <Button onClick={() => setShowAddMemberDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Your First Member
                </Button>
              )}
            </div>
          ) : (
            <>
              <UserListCore
                users={paginatedUsers}
                isAdmin={isAdminUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />

              <MembersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AddMemberDialog
        isOpen={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />

      <EditUserDialog
        isOpen={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        isSubmitting={isSubmitting}
        user={selectedUser}
      />
    </div>
  );
};

export default CleanAdminUsers;
