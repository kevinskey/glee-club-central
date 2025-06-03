
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

interface FolderAssignment {
  id: string;
  member_id: string;
  folder_number: string;
  status: 'checked_out' | 'returned' | 'missing';
  assigned_date: string;
  member_name: string;
}

export function FolderInventory() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<FolderAssignment[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    member_id: '',
    folder_number: '',
    status: 'checked_out' as 'checked_out' | 'returned' | 'missing'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: folderData, error: folderError } = await supabase
        .from('folder_assignments')
        .select(`
          *,
          profiles!folder_assignments_member_id_fkey (first_name, last_name)
        `)
        .order('folder_number');

      if (folderError) throw folderError;

      const { data: memberData, error: memberError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('last_name');

      if (memberError) throw memberError;

      const formattedFolders = folderData?.map(folder => ({
        id: folder.id,
        member_id: folder.member_id,
        folder_number: folder.folder_number,
        status: folder.status,
        assigned_date: folder.assigned_date,
        member_name: `${folder.profiles?.first_name || ''} ${folder.profiles?.last_name || ''}`.trim() || 'Unknown Member'
      })) || [];

      setFolders(formattedFolders);
      setMembers(memberData || []);
    } catch (error) {
      console.error('Error fetching folder data:', error);
      toast.error('Failed to load folder assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.member_id || !form.folder_number) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('folder_assignments')
        .insert({
          member_id: form.member_id,
          folder_number: form.folder_number,
          status: form.status,
          assigned_by: user?.id
        });

      if (error) throw error;

      setForm({ member_id: '', folder_number: '', status: 'checked_out' });
      setShowForm(false);
      fetchData();
      toast.success('Folder assignment added successfully');
    } catch (error) {
      console.error('Error adding folder assignment:', error);
      toast.error('Failed to add folder assignment');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('folder_assignments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
      toast.success('Folder status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Member Name', 'Folder Number', 'Status', 'Assigned Date'],
      ...folders.map(folder => [
        folder.member_name,
        folder.folder_number,
        folder.status,
        folder.assigned_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `folder-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-8">Loading folder inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Folder Assignment
        </Button>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Folder Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Member *</label>
                  <Select value={form.member_id} onValueChange={(value) => setForm(prev => ({ ...prev, member_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Folder Number *</label>
                  <Input
                    value={form.folder_number}
                    onChange={(e) => setForm(prev => ({ ...prev, folder_number: e.target.value }))}
                    placeholder="e.g., F001"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status *</label>
                  <Select value={form.status} onValueChange={(value: any) => setForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checked_out">Checked Out</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Assignment</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Folder Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Folder Number</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folders.map((folder) => (
                <TableRow key={folder.id}>
                  <TableCell className="font-medium">{folder.member_name}</TableCell>
                  <TableCell>{folder.folder_number}</TableCell>
                  <TableCell>
                    <Badge variant={folder.status === 'returned' ? 'default' : folder.status === 'missing' ? 'destructive' : 'secondary'}>
                      {folder.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(folder.assigned_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={folder.status} onValueChange={(value) => updateStatus(folder.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checked_out">Checked Out</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
