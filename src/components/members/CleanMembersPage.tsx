
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { UserListCore } from './UserListCore';
import { StreamlinedFilters } from './StreamlinedFilters';
import { MembersPagination } from './MembersPagination';
import { CreateUserModal } from './CreateUserModal';
import { AddMemberDialog } from './AddMemberDialog';
import { EditUserDialog } from './EditUserDialog';
import { UserFormValues } from './form/userFormSchema';
import { toast } from 'sonner';

export function CleanMembersPage() {
  const { isAdmin, isLoading: authLoading, isAuthenticated } = useAuthMigration();
  const {
    filteredUsers,
    isLoading: usersLoading,
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdminUser = isAdmin();

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    return value !== 'all';
  }).length;

  const handleUserCreated = () => {
    refetch();
  };

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to view member information.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            Manage choir members and their information ({filteredUsers.length} total members)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" disabled={usersLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {isAdminUser && (
            <>
              <Button onClick={() => setShowAddMemberDialog(true)} variant="default">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
              <Button onClick={() => setShowCreateModal(true)} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Quick Add
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading members: {error}</AlertDescription>
        </Alert>
      )}

      <StreamlinedFilters
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />

      {usersLoading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading members...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, filteredUsers.length)} of {filteredUsers.length} members
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
            </p>
            <p>Page {currentPage} of {totalPages}</p>
          </div>

          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Members Found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeFilterCount > 0 ? 'No members match your current filters.' : 'No members have been added yet.'}
                </p>
                {isAdminUser && activeFilterCount === 0 && (
                  <Button onClick={() => setShowAddMemberDialog(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Your First Member
                  </Button>
                )}
              </CardContent>
            </Card>
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
        </>
      )}

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />

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
}
