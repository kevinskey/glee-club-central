
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, DollarSign, Music, Camera, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  voice_part: string;
  status: string;
  avatar_url?: string;
  dues_paid: boolean;
  phone?: string;
  class_year?: string;
  role_tags: string[];
  join_date?: string;
  account_balance: number;
}

interface MemberStats {
  totalEvents: number;
  attendanceRate: number;
  practiceHours: number;
  recordings: number;
}

export default function MemberDashboardAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const VOICE_PARTS = ['soprano_1', 'soprano_2', 'alto_1', 'alto_2', 'tenor', 'bass'];
  const ROLES = ['member', 'section_leader', 'officer', 'admin'];
  const AVAILABLE_TAGS = ['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'alumni', 'new_member'];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberStats = async (memberId: string) => {
    try {
      // Fetch attendance records
      const { data: attendance } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('member_id', memberId);

      // Fetch practice logs
      const { data: practices } = await supabase
        .from('practice_logs')
        .select('minutes_practiced')
        .eq('user_id', memberId);

      // Fetch recordings
      const { data: recordings } = await supabase
        .from('track_recordings')
        .select('id')
        .eq('user_id', memberId);

      const totalEvents = attendance?.length || 0;
      const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalEvents > 0 ? (presentCount / totalEvents) * 100 : 0;
      const practiceHours = practices?.reduce((sum, p) => sum + (p.minutes_practiced || 0), 0) || 0;

      setMemberStats({
        totalEvents,
        attendanceRate,
        practiceHours: Math.round(practiceHours / 60),
        recordings: recordings?.length || 0
      });
    } catch (error) {
      console.error('Error fetching member stats:', error);
    }
  };

  const updateMember = async (memberId: string, updates: Partial<Member>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Member updated successfully');
      fetchMembers();
      
      if (selectedMember?.id === memberId) {
        setSelectedMember({ ...selectedMember, ...updates });
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleTagToggle = (memberId: string, tag: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const currentTags = member.role_tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    updateMember(memberId, { role_tags: newTags });
  };

  const openMemberDialog = async (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
    await fetchMemberStats(member.id);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-muted-foreground">Manage choir member profiles and information</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map(role => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openMemberDialog(member)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{member.role}</Badge>
                      {member.voice_part && (
                        <Badge variant="secondary">{member.voice_part}</Badge>
                      )}
                      <Badge variant={member.dues_paid ? "default" : "destructive"}>
                        {member.dues_paid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {member.role_tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedMember?.first_name} {selectedMember?.last_name}
            </DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {memberStats?.attendanceRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {memberStats?.totalEvents} events attended
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        Practice Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {memberStats?.practiceHours}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        hours logged
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedMember.account_balance?.toFixed(2) || '0.00'}
                      </div>
                      <Badge variant={selectedMember.dues_paid ? "default" : "destructive"}>
                        {selectedMember.dues_paid ? "Dues Paid" : "Dues Pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-muted-foreground">{selectedMember.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Class Year</label>
                        <p className="text-sm text-muted-foreground">{selectedMember.class_year || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Join Date</label>
                        <p className="text-sm text-muted-foreground">
                          {selectedMember.join_date ? new Date(selectedMember.join_date).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Activity tracking will be implemented with event attendance and practice logs.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Role & Voice Part</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <Select
                          value={selectedMember.role}
                          onValueChange={(value) => updateMember(selectedMember.id, { role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map(role => (
                              <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Voice Part</label>
                        <Select
                          value={selectedMember.voice_part || ''}
                          onValueChange={(value) => updateMember(selectedMember.id, { voice_part: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select voice part" />
                          </SelectTrigger>
                          <SelectContent>
                            {VOICE_PARTS.map(part => (
                              <SelectItem key={part} value={part}>
                                {part.replace('_', ' ').toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Role Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {AVAILABLE_TAGS.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedMember.role_tags?.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(selectedMember.id, tag)}
                        >
                          {tag.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
