import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, Plus, Edit, Mail, Phone, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

interface AuthUser {
  id: string;
  email?: string;
}

export function MembersPageSimple() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

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
            class_year: profile.class_year
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
            class_year: profile.class_year
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
            class_year: profile.class_year
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

  const filteredMembers = members.filter(member => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email?.toLowerCase() || '';
    return fullName.includes(search) || email.includes(search);
  });

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
          <Button onClick={() => toast.info('Add member functionality coming soon')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredMembers.length} of {members.length} members
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
                          onClick={() => toast.info('Edit functionality coming soon')}
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
    </div>
  );
}
