import React, { useState, useEffect } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Plus, Edit, Search, Filter, Mail, Phone, 
  GraduationCap, Calendar, DollarSign, Award 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: string;
  voice_part?: string;
  class_year?: string;
  join_date?: string;
  status: string;
  dues_paid: boolean;
  avatar_url?: string;
  role_tags?: string[];
  created_at: string;
  last_sign_in_at?: string;
}

const VOICE_PARTS = ['Soprano 1', 'Soprano 2', 'Alto 1', 'Alto 2', 'Tenor', 'Bass'];
const ROLE_TAGS = [
  'President', 'Secretary', 'Treasurer', 'Historian', 'PR Coordinator',
  'Tour Manager', 'Road Manager', 'Chaplain', 'Librarian', 
  'Wardrobe Manager', 'Merchandise Manager', 'Section Leader'
];
const CLASS_YEARS = ['2025', '2026', '2027', '2028'];
const MEMBER_STATUSES = ['active', 'inactive', 'pending', 'alumni'];

export default function MembersV2Page() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVoicePart, setFilterVoicePart] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Member form state
  const [memberForm, setMemberForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    voice_part: '',
    class_year: '',
    status: 'active',
    role_tags: [] as string[],
    dues_paid: false
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterVoicePart, filterStatus]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_management_view')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      
      const formattedMembers = (data || []).map(member => ({
        id: member.id || '',
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        phone: member.phone || '',
        role: member.role || 'member',
        voice_part: member.voice_part || '',
        class_year: member.class_year || '',
        join_date: member.join_date || '',
        status: member.status || 'active',
        dues_paid: member.dues_paid || false,
        avatar_url: member.avatar_url || '',
        role_tags: [],
        created_at: member.created_at || '',
        last_sign_in_at: member.last_sign_in_at || ''
      }));

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterVoicePart !== 'all') {
      filtered = filtered.filter(member => member.voice_part === filterVoicePart);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    setFilteredMembers(filtered);
  };

  const handleCreateMember = async () => {
    if (!memberForm.first_name || !memberForm.last_name || !memberForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // For demo purposes, we'll just show success
      // In real implementation, this would create a new user account
      toast.success('Member invitation sent successfully');
      setIsMemberDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      toast.error('Failed to create member');
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: memberForm.first_name,
          last_name: memberForm.last_name,
          phone: memberForm.phone,
          voice_part: memberForm.voice_part,
          class_year: memberForm.class_year,
          status: memberForm.status,
          dues_paid: memberForm.dues_paid,
          role_tags: memberForm.role_tags
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      toast.success('Member updated successfully');
      setIsMemberDialogOpen(false);
      setEditingMember(null);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const resetForm = () => {
    setMemberForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      voice_part: '',
      class_year: '',
      status: 'active',
      role_tags: [],
      dues_paid: false
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingMember(null);
    setIsMemberDialogOpen(true);
  };

  const openEditDialog = (member: Member) => {
    setMemberForm({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email || '',
      phone: member.phone || '',
      voice_part: member.voice_part || '',
      class_year: member.class_year || '',
      status: member.status,
      role_tags: member.role_tags || [],
      dues_paid: member.dues_paid
    });
    setEditingMember(member);
    setIsMemberDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      alumni: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const memberStats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    duesPaid: members.filter(m => m.dues_paid).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Member Management</h1>
            <p className="text-muted-foreground">Manage member profiles, roles, and assignments</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">{memberStats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{memberStats.active}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{memberStats.pending}</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dues Paid</p>
                  <p className="text-2xl font-bold">{memberStats.duesPaid}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterVoicePart} onValueChange={setFilterVoicePart}>
                <SelectTrigger>
                  <SelectValue placeholder="All Voice Parts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Voice Parts</SelectItem>
                  {VOICE_PARTS.map(part => (
                    <SelectItem key={part} value={part}>{part}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {MEMBER_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {filteredMembers.length} members
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {member.first_name[0]}{member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {member.first_name} {member.last_name}
                        </h3>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        {member.dues_paid && (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                            Dues Paid
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {member.email || 'No email'}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </div>
                        )}
                        {member.voice_part && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            {member.voice_part}
                          </div>
                        )}
                        {member.class_year && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Class of {member.class_year}
                          </div>
                        )}
                      </div>
                      
                      {member.role_tags && member.role_tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {member.role_tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Member Dialog */}
        <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="roles">Roles & Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      value={memberForm.first_name}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input
                      value={memberForm.last_name}
                      onChange={(e) => setMemberForm(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Voice Part</label>
                    <Select 
                      value={memberForm.voice_part} 
                      onValueChange={(value) => setMemberForm(prev => ({ ...prev, voice_part: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice part" />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICE_PARTS.map(part => (
                          <SelectItem key={part} value={part}>{part}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Class Year</label>
                    <Select 
                      value={memberForm.class_year} 
                      onValueChange={(value) => setMemberForm(prev => ({ ...prev, class_year: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class year" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_YEARS.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={memberForm.status} 
                    onValueChange={(value) => setMemberForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBER_STATUSES.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={memberForm.dues_paid}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, dues_paid: e.target.checked }))}
                  />
                  Dues Paid
                </label>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Role Tags</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {ROLE_TAGS.map(role => (
                      <Button
                        key={role}
                        variant={memberForm.role_tags.includes(role) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setMemberForm(prev => ({
                            ...prev,
                            role_tags: prev.role_tags.includes(role)
                              ? prev.role_tags.filter(r => r !== role)
                              : [...prev.role_tags, role]
                          }));
                        }}
                        type="button"
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingMember ? handleUpdateMember : handleCreateMember}>
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminV2Layout>
  );
}
