
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  UserPlus, 
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { User } from '@/hooks/user/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function UserManagementSimplified() {
  const { isAuthenticated, isLoading, isAdmin, user } = useSimpleAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminUser = isAdmin ? isAdmin() : false;

  console.log('🔍 UserManagementSimplified: Component state:', {
    isAuthenticated,
    isLoading,
    isAdminUser,
    userEmail: user?.email,
    usersLoading,
    error,
    usersCount: users.length
  });

  const fetchUsers = async () => {
    console.log('🔄 UserManagementSimplified: Starting user fetch...');
    setUsersLoading(true);
    setError(null);
    
    try {
      // First check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError('You must be logged in to view users');
        toast.error('Authentication required');
        return;
      }

      console.log('✅ Current user authenticated:', currentUser.email);

      // For known admin users, try to get all profiles
      if (currentUser.email === 'kevinskey@mac.com') {
        console.log('🔍 Admin user detected, attempting to fetch all profiles...');
        
        // Try fetching profiles with enhanced error handling
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(50);

        if (profilesError) {
          console.error('❌ Profiles query failed:', profilesError);
          
          // If RLS is still blocking, create a minimal fallback
          if (profilesError.code === '42P17' || profilesError.message.includes('infinite recursion')) {
            console.log('🆘 RLS recursion detected, using fallback admin profile...');
            
            const fallbackUser: User = {
              id: currentUser.id,
              email: currentUser.email,
              first_name: 'Kevin',
              last_name: 'Key',
              phone: null,
              voice_part: null,
              avatar_url: null,
              status: 'active',
              join_date: null,
              class_year: null,
              dues_paid: false,
              notes: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_sign_in_at: null,
              is_super_admin: true,
              role: 'admin',
              personal_title: null,
              title: null,
              special_roles: null
            };
            
            setUsers([fallbackUser]);
            toast.warning('RLS policies need fixing - showing admin profile only');
            return;
          }
          
          setError(`Database error: ${profilesError.message}`);
          toast.error(`Failed to load users: ${profilesError.message}`);
          return;
        }

        console.log('✅ Profiles query successful:', profiles?.length || 0, 'profiles');

        // Transform profile data to User format
        const transformedUsers: User[] = (profiles || []).map(profile => ({
          id: profile.id,
          email: currentUser.email, // We only have the current user's email
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone,
          voice_part: profile.voice_part,
          avatar_url: profile.avatar_url,
          status: profile.status || 'active',
          join_date: profile.join_date,
          class_year: profile.class_year,
          dues_paid: profile.dues_paid || false,
          notes: profile.notes,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          last_sign_in_at: null,
          is_super_admin: profile.is_super_admin || false,
          role: profile.role || 'member',
          personal_title: profile.title || null,
          title: profile.title || null,
          special_roles: profile.special_roles || null
        }));

        setUsers(transformedUsers);
        
        if (transformedUsers.length === 1 && transformedUsers[0].id === currentUser.id) {
          toast.warning(`Loaded own profile only (${transformedUsers.length} user) - RLS may need admin setup`);
        } else {
          toast.success(`Successfully loaded ${transformedUsers.length} users`);
        }
      } else {
        // For non-admin users, just show their own profile
        console.log('👤 Non-admin user, fetching own profile only...');
        
        const { data: ownProfile, error: ownError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (ownError) {
          console.error('❌ Own profile fetch failed:', ownError);
          setError(`Failed to load profile: ${ownError.message}`);
          return;
        }
        
        if (ownProfile) {
          const ownUser: User = {
            id: ownProfile.id,
            email: currentUser.email,
            first_name: ownProfile.first_name || '',
            last_name: ownProfile.last_name || '',
            phone: ownProfile.phone,
            voice_part: ownProfile.voice_part,
            avatar_url: ownProfile.avatar_url,
            status: ownProfile.status || 'active',
            join_date: ownProfile.join_date,
            class_year: ownProfile.class_year,
            dues_paid: ownProfile.dues_paid || false,
            notes: ownProfile.notes,
            created_at: ownProfile.created_at,
            updated_at: ownProfile.updated_at,
            last_sign_in_at: null,
            is_super_admin: ownProfile.is_super_admin || false,
            role: ownProfile.role || 'member',
            personal_title: ownProfile.title || null,
            title: ownProfile.title || null,
            special_roles: ownProfile.special_roles || null
          };
          
          setUsers([ownUser]);
          toast.info('Showing your profile only - admin access required for all users');
        }
      }
      
    } catch (err) {
      console.error('💥 Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to load users due to unexpected error');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚀 UserManagementSimplified: Auto-loading users on mount');
      fetchUsers();
    }
  }, [isAuthenticated]);

  const filteredMembers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTermLower) || (user.email || '').toLowerCase().includes(searchTermLower);
  });

  if (isLoading || usersLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user management...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please sign in to access user management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage choir members</p>
        </div>

        <Card className="border-destructive/50">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to Load Users</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <p className="text-xs text-muted-foreground">
                If this persists, check browser console for details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage choir members and their information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No members match your search criteria.' : 'No members have been loaded yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Load Members
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Members ({filteredMembers.length})</h2>
            <Badge variant="outline">{users.length} total users</Badge>
          </div>
          
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {member.first_name} {member.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {member.email}
                          </div>
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
                      {member.is_super_admin && (
                        <Badge variant="destructive">
                          <Shield className="mr-1 h-3 w-3" />
                          Super Admin
                        </Badge>
                      )}
                      {member.role && (
                        <Badge variant={member.role === 'admin' ? 'destructive' : 'secondary'}>
                          {member.role}
                        </Badge>
                      )}
                      {member.voice_part && (
                        <Badge variant="outline">
                          {member.voice_part}
                        </Badge>
                      )}
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
