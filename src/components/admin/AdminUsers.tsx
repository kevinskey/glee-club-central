
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from "@/components/ui/page-header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Upload, 
  RefreshCw, 
  Edit, 
  Trash2, 
  AlertCircle,
  Mail,
  Phone,
  Music
} from "lucide-react";
import { useUserList } from '@/hooks/user/useUserList';
import { useUserUpdate } from '@/hooks/user/useUserUpdate';
import { useUserCreate } from '@/hooks/user/useUserCreate';
import { MemberFiltersAdvanced, MemberFilters } from '../members/MemberFiltersAdvanced';
import { MembersPagination } from '../members/MembersPagination';
import { EditUserDialog } from '../members/EditUserDialog';
import { AddMemberDialog } from '../members/AddMemberDialog';
import { UserFormValues } from '../members/form/userFormSchema';
import { toast } from 'sonner';

const USERS_PER_PAGE = 6;

const AdminUsers: React.FC = () => {
  const { users, isLoading: usersLoading, error, refetch } = useUserList();
  const { addUser } = useUserCreate();
  const { updateUser } = useUserUpdate(refetch);
  
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    role: 'all',
    status: 'all',
    voicePart: 'all',
    classYear: 'all',
    duesPaid: 'all',
    isAdmin: 'all'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply filters to users
  const filteredUsers = users.filter(user => {
    // Search filter
    if (filters.search) {
      const searchTermLower = filters.search.toLowerCase();
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const notes = (user.notes || '').toLowerCase();
      
      const matchesSearch = fullName.includes(searchTermLower) || 
                           email.includes(searchTermLower) || 
                           notes.includes(searchTermLower);
      
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }

    // Voice part filter
    if (filters.voicePart !== 'all' && user.voice_part !== filters.voicePart) {
      return false;
    }

    // Class year filter
    if (filters.classYear !== 'all' && user.class_year !== filters.classYear) {
      return false;
    }

    // Dues paid filter
    if (filters.duesPaid !== 'all') {
      const isDuesPaid = user.dues_paid === true;
      const filterValue = filters.duesPaid === 'true';
      if (isDuesPaid !== filterValue) return false;
    }

    // Admin status filter
    if (filters.isAdmin !== 'all') {
      const isUserAdmin = user.is_super_admin === true || user.role === 'admin';
      const filterValue = filters.isAdmin === 'true';
      if (isUserAdmin !== filterValue) return false;
    }

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Count active filters
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
        refetch();
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
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="User Management"
        description={`Manage Glee Club members and their roles (${users.length} total members)`}
        icon={<Users className="h-6 w-6" />}
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading members: {error}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members Directory</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" disabled={usersLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
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
          {/* Advanced Filters */}
          <MemberFiltersAdvanced
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Loading State */}
          {usersLoading && (
            <div className="text-center py-8 mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading members...</p>
            </div>
          )}

          {/* Main Content */}
          {!usersLoading && (
            <>
              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 mb-4">
                <p>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} members
                  {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
                </p>
                <p>Page {currentPage} of {totalPages}</p>
              </div>

              {/* Member List */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Members Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {users.length === 0 
                      ? 'No members have been added yet.' 
                      : activeFilterCount > 0
                        ? 'No members match your current filters.'
                        : 'No members found.'
                    }
                  </p>
                  {users.length === 0 && (
                    <Button onClick={() => setShowAddMemberDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Member
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {paginatedUsers.map((member) => (
                      <Card 
                        key={member.id} 
                        className="transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-primary/50"
                        onClick={() => handleEditUser(member)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>
                                  {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {member.first_name} {member.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {member.email || 'No email'}
                                </p>
                                {member.phone && (
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Phone className="mr-1 h-3 w-3" />
                                    {member.phone}
                                  </p>
                                )}
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
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  <MembersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
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

export default AdminUsers;
