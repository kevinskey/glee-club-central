import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { UserListCore } from './UserListCore';
import { StreamlinedFilters } from './StreamlinedFilters';
import { MembersPagination } from './MembersPagination';
import { CreateUserModal } from './CreateUserModal';
import { AddMemberDialog } from './AddMemberDialog';
import { EditUserDialog } from './EditUserDialog';
import { LoadingErrorBoundary } from './LoadingErrorBoundary';
import { UserFormValues } from './form/userFormSchema';
import { toast } from 'sonner';

export function CleanMembersPage() {
  console.log('🔧 CleanMembersPage: Component started rendering');
  
  const { profile, isLoading: authLoading, user } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin' || profile?.is_super_admin;

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

  console.log('🔧 CleanMembersPage: Hook states:', {
    authLoading,
    isAuthenticated,
    usersLoading,
    error,
    filteredUsersCount: filteredUsers.length,
    paginatedUsersCount: paginatedUsers.length
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    return value !== 'all';
  }).length;

  const handleUserCreated = () => {
    console.log('🔄 User created, refreshing data');
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
    console.log('🔧 Editing user:', user.id);
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

  const handleRetry = () => {
    console.log('🔄 Retrying data fetch');
    refetch();
  };

  return (
    <LoadingErrorBoundary 
      isLoading={authLoading} 
      error={!isAuthenticated ? 'Not authenticated' : null}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                Members
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage choir members ({filteredUsers.length} total)
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                disabled={usersLoading}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${usersLoading ? 'animate-spin' : ''}`} />
                <span className="ml-1 sm:ml-2">Refresh</span>
              </Button>
              
              {isAdmin && (
                <>
                  <Button 
                    onClick={() => setShowAddMemberDialog(true)} 
                    variant="default"
                    size="sm"
                    className="text-xs sm:text-sm bg-glee-spelman hover:bg-glee-spelman/90"
                  >
                    <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="ml-1 sm:ml-2 hidden sm:inline">Add Member</span>
                    <span className="ml-1 sm:hidden">Add</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setShowCreateModal(true)} 
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="ml-1 sm:ml-2 hidden sm:inline">Quick Add</span>
                    <span className="ml-1 sm:hidden">Quick</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <LoadingErrorBoundary 
          error={error} 
          isLoading={usersLoading}
          onRetry={handleRetry}
        >
          <StreamlinedFilters
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <p>
              Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, filteredUsers.length)} of {filteredUsers.length} members
              {activeFilterCount > 0 && (
                <span className="hidden sm:inline">
                  {` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
                </span>
              )}
            </p>
            <p>Page {currentPage} of {totalPages}</p>
          </div>

          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Members Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeFilterCount > 0 ? 'No members match your current filters.' : 'No members have been added yet.'}
                </p>
                {isAdmin && activeFilterCount === 0 && (
                  <Button 
                    onClick={() => setShowAddMemberDialog(true)}
                    size="sm"
                    className="text-sm"
                  >
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
                isAdmin={isAdmin}
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
        </LoadingErrorBoundary>

        {/* Modals */}
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
    </LoadingErrorBoundary>
  );
}
