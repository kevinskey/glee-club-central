import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone,
  Calendar,
  Music,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuthMigration } from '@/hooks/useAuthMigration';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  voice_part: string;
  status: string;
  join_date: string;
  avatar_url?: string;
  phone?: string;
  class_year?: string;
}

export function MembersPageRefactor() {
  const { isAdmin, isLoading, isAuthenticated, profile } = useAuthMigration();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState('all');
  const [loading, setLoading] = useState(true);

  const isAdminUser = isAdmin();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      // Mock data - replace with actual data fetching
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockMembers: Member[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          voice_part: 'Tenor',
          status: 'active',
          join_date: '2022-08-15',
          avatar_url: 'https://avatars.dicebear.com/api/male/john.svg',
          phone: '123-456-7890',
          class_year: '2024'
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          voice_part: 'Soprano',
          status: 'active',
          join_date: '2023-01-20',
          avatar_url: 'https://avatars.dicebear.com/api/female/jane.svg',
          phone: '987-654-3210',
          class_year: '2025'
        },
        {
          id: '3',
          first_name: 'Alice',
          last_name: 'Johnson',
          email: 'alice.johnson@example.com',
          voice_part: 'Alto',
          status: 'inactive',
          join_date: '2022-05-10',
          avatar_url: 'https://avatars.dicebear.com/api/female/alice.svg',
          class_year: '2023'
        },
      ];
      setMembers(mockMembers);
      setLoading(false);
    };

    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]);

  const filteredMembers = members.filter(member => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) || member.email.toLowerCase().includes(searchTermLower);

    const matchesVoicePart = selectedVoicePart === 'all' || member.voice_part === selectedVoicePart;

    return matchesSearch && matchesVoicePart;
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading members...</p>
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
            Manage choir members and their information
          </p>
        </div>
        {isAdminUser && (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>

      {/* Search and filter controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members list placeholder */}
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Member List Coming Soon</h3>
          <p className="text-muted-foreground">
            Member management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
