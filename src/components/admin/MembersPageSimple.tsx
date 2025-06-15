import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Edit, Mail, Phone, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EditUserDialog } from '@/components/members/EditUserDialog';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { MembersFilters } from './MembersFilters';
import { useMembersFiltering } from '@/hooks/useMembersFiltering';

interface Member {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  voice_part?: string;
  status?: string;
  avatar_url?: string;
  dues_paid?: boolean;
  class_year?: string;
  notes?: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

export function MembersPageSimple() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    filters,
    filteredMembers,
    activeFilterCount,
    updateSearch,
    updateRoleFilter,
    updateStatusFilter,
    updateVoicePartFilter,
    updateDuesPaidFilter,
    clearFilters
  } = useMembersFiltering(members);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading members...');
      
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Get profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        setError(profilesError.message);
        return;
      }

      console.log('✅ Profiles loaded:', profiles?.length || 0);

      // Get auth users for emails (admin only)
      const isAdmin = user.email === 'kevinskey@mac.com' || 
        profiles?.find(p => p.id === user.id)?.is_super_admin;

      let membersWithEmails: Member[] = [];

      if (isAdmin) {
        try {
          // Try to get auth users for emails
          const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.warn('Could not fetch emails:', authError);
          }

          const emailMap = new Map<string, string>();
          if (authUsers?.users) {
            (authUsers.users as AuthUser[]).forEach(authUser => {
              emailMap.set(authUser.id, authUser.email || '');
            });
          }

          membersWithEmails = (profiles || []).map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: emailMap.get(profile.id) || '',
            phone: profile.phone,
            role: profile.role || 'member',
            voice_part: profile.voice_part,
            status: profile.status || 'active',
            avatar_url: profile.avatar_url,
            dues_paid: profile.dues_paid || false,
            class_year: profile.class_year,
            notes: profile.notes
          }));
        } catch (authError) {
          console.warn('Auth fetch failed, using profiles only:', authError);
          membersWithEmails = (profiles || []).map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.id === user.id ? user.email || '' : '',
            phone: profile.phone,
            role: profile.role || 'member',
            voice_part: profile.voice_part,
            status: profile.status || 'active',
            avatar_url: profile.avatar_url,
            dues_paid: profile.dues_paid || false,
            class_year: profile.class_year,
            notes: profile.notes
          }));
        }
      } else {
        // Non-admin can only see their own profile
        membersWithEmails = (profiles || [])
          .filter(profile => profile.id === user.id)
          .map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: user.email || '',
            phone: profile.phone,
            role: profile.role || 'member',
            voice_part: profile.voice_part,
            status: profile.status || 'active',
            avatar_url: profile.avatar_url,
            dues_paid: profile.dues_paid || false,
            class_year: profile.class_year,
            notes: profile.notes
          }));
      }

      setMembers(membersWithEmails);
      console.log('✅ Members processed:', membersWithEmails.length);
      
    } catch (error) {
      console.error('💥 Error loading members:', error);
      setError(error instanceof Error ? error.message : 'Failed to load members');
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleSaveMember = async (data: UserFormValues) => {
    if (!selectedMember) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          voice_part: data.voice_part,
          status: data.status,
          class_year: data.class_year,
          notes: data.notes,
          dues_paid: data.dues_paid,
          role: data.role,
          is_super_admin: data.is_admin,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMember.id);

      if (error) {
        console.error('Error updating member:', error);
        toast.error('Failed to update member');
        return;
      }

      toast.success('Member updated successfully');
      setShowEditDialog(false);
      setSelectedMember(null);
      await loadMembers(); // Refresh the list
      
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // For now, just show success message as full user creation requires more setup
      toast.success('Add member functionality will be implemented soon');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatVoicePart = (voicePart?: string) => {
    if (!voicePart) return '';
    return voicePart.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Members Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading members...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Members Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={loadMembers}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Members Management ({members.length} members)
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <MembersFilters
            search={filters.search}
            onSearchChange={updateSearch}
            roleFilter={filters.roleFilter}
            onRoleFilterChange={updateRoleFilter}
            statusFilter={filters.statusFilter}
            onStatusFilterChange={updateStatusFilter}
            voicePartFilter={filters.voicePartFilter}
            onVoicePartFilterChange={updateVoicePartFilter}
            duesPaidFilter={filters.duesPaidFilter}
            onDuesPaidFilterChange={updateDuesPaidFilter}
            onClearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground my-4">
            Showing {filteredMembers.length} of {members.length} members
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied)`}
          </div>

          {/* Members List */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Members Found</h3>
              <p className="text-muted-foreground">
                {members.length === 0 
                  ? 'No members have been added yet.' 
                  : 'No members match your search criteria.'
                }
              </p>
              {activeFilterCount > 0 && (
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
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
                          {member.email && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {member.email}
                            </p>
                          )}
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
                            {formatVoicePart(member.voice_part)}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditUserDialog
        isOpen={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedMember(null);
        }}
        onSave={handleSaveMember}
        isSubmitting={isSubmitting}
        user={selectedMember}
      />

      {/* Add Dialog */}
      <AddMemberDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
