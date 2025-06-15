
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  MoreVertical, 
  RefreshCw, 
  Edit, 
  Mail,
  Phone,
  Music
} from 'lucide-react';
import { useUnifiedUserManagement } from '@/hooks/user/useUnifiedUserManagement';
import { StreamlinedFilters } from '@/components/members/StreamlinedFilters';
import { MembersPagination } from '@/components/members/MembersPagination';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';
import { EditUserDialog } from '@/components/members/EditUserDialog';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';

export function MemberManagement() {
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

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    return value !== 'all';
  }).length;

  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setShowAddDialog(false);
        toast.success('Member added successfully');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
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
      console.log('Submitting user update for user:', selectedUser.id);
      console.log('Form data received:', data);
      
      // Create clean update object with only changed fields
      const updateData: any = {};
      
      // Only include fields that have values
      if (data.first_name?.trim()) updateData.first_name = data.first_name.trim();
      if (data.last_name?.trim()) updateData.last_name = data.last_name.trim();
      if (data.phone?.trim()) updateData.phone = data.phone.trim();
      if (data.voice_part) updateData.voice_part = data.voice_part;
      if (data.status) updateData.status = data.status;
      if (data.class_year?.trim()) updateData.class_year = data.class_year.trim();
      if (data.notes?.trim()) updateData.notes = data.notes.trim();
      if (data.join_date) updateData.join_date = data.join_date;
      
      // Handle boolean fields properly
      if (typeof data.dues_paid === 'boolean') {
        updateData.dues_paid = data.dues_paid;
      }
      
      // Handle role and admin status
      if (data.role) {
        updateData.role = data.role;
      }
      
      if (typeof data.is_admin === 'boolean') {
        updateData.is_admin = data.is_admin;
      }

      console.log('Prepared update data:', updateData);

      const success = await updateUser(selectedUser.id, updateData);
      if (success) {
        setShowEditDialog(false);
        setSelectedUser(null);
        toast.success('User updated successfully');
      } else {
        toast.error('Failed to update user - please check the console for details');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading members: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Member Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage Glee Club members ({filteredUsers.length} total)
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={refetch} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-glee-spelman hover:bg-glee-spelman/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <StreamlinedFilters
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, filteredUsers.length)} of {filteredUsers.length} members
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
        </p>
        <p>Page {currentPage} of {totalPages}</p>
      </div>

      {/* Member List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Members Found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilterCount > 0 ? 'No members match your current filters.' : 'No members have been added yet.'}
            </p>
            {activeFilterCount === 0 && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Member
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedUsers.map((member) => (
              <Card 
                key={member.id} 
                className="transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-glee-spelman/50"
                onClick={() => handleEditUser(member)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback className="bg-glee-spelman/10 text-glee-spelman font-semibold">
                          {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {member.first_name} {member.last_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {member.email && (
                            <div className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {member.role && (
                        <Badge variant={member.role === 'admin' ? 'destructive' : 'outline'}>
                          {member.role}
                        </Badge>
                      )}
                      {member.voice_part && (
                        <Badge variant="outline">
                          <Music className="mr-1 h-3 w-3" />
                          {member.voice_part.replace('_', ' ')}
                        </Badge>
                      )}
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status || 'active'}
                      </Badge>
                      {member.dues_paid && (
                        <Badge variant="default" className="bg-green-600">
                          Dues Paid
                        </Badge>
                      )}
                      {member.class_year && (
                        <Badge variant="outline">
                          Class {member.class_year}
                        </Badge>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditUser(member);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <MembersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Dialogs */}
      <AddMemberDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
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
