
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Upload, Download, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SheetMusicAssignment {
  id: string;
  member_id: string;
  sheet_music_id: string;
  assigned_date: string;
  returned_date: string | null;
  status: 'assigned' | 'returned' | 'overdue';
  notes: string | null;
  member_name: string;
  sheet_music_title: string;
}

export function SheetMusicTracker() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<SheetMusicAssignment[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [sheetMusic, setSheetMusic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    member_id: '',
    sheet_music_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch assignments with member and sheet music info
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('sheet_music_assignments')
        .select(`
          *,
          profiles!sheet_music_assignments_member_id_fkey (first_name, last_name),
          sheet_music (title)
        `)
        .order('assigned_date', { ascending: false });

      if (assignmentError) throw assignmentError;

      // Fetch members for dropdown
      const { data: memberData, error: memberError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('last_name');

      if (memberError) throw memberError;

      // Fetch sheet music for dropdown
      const { data: musicData, error: musicError } = await supabase
        .from('sheet_music')
        .select('id, title, composer')
        .order('title');

      if (musicError) throw musicError;

      const formattedAssignments = assignmentData?.map(assignment => ({
        id: assignment.id,
        member_id: assignment.member_id,
        sheet_music_id: assignment.sheet_music_id,
        assigned_date: assignment.assigned_date,
        returned_date: assignment.returned_date,
        status: assignment.status,
        notes: assignment.notes,
        member_name: `${assignment.profiles?.first_name || ''} ${assignment.profiles?.last_name || ''}`.trim() || 'Unknown Member',
        sheet_music_title: assignment.sheet_music?.title || 'Unknown Title'
      })) || [];

      setAssignments(formattedAssignments);
      setMembers(memberData || []);
      setSheetMusic(musicData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load sheet music assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.member_id || !form.sheet_music_id) {
      toast.error('Please select both member and sheet music');
      return;
    }

    try {
      const { error } = await supabase
        .from('sheet_music_assignments')
        .insert({
          member_id: form.member_id,
          sheet_music_id: form.sheet_music_id,
          notes: form.notes || null,
          assigned_by: user?.id
        });

      if (error) throw error;

      setForm({ member_id: '', sheet_music_id: '', notes: '' });
      setShowForm(false);
      fetchData();
      toast.success('Sheet music assigned successfully');
    } catch (error) {
      console.error('Error assigning sheet music:', error);
      toast.error('Failed to assign sheet music');
    }
  };

  const markAsReturned = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sheet_music_assignments')
        .update({
          status: 'returned',
          returned_date: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      fetchData();
      toast.success('Sheet music marked as returned');
    } catch (error) {
      console.error('Error marking as returned:', error);
      toast.error('Failed to mark as returned');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading sheet music assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button onClick={() => setShowForm(!showForm)}>
          <Upload className="h-4 w-4 mr-2" />
          Assign Sheet Music
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Sheet Music to Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium">Sheet Music *</label>
                  <Select value={form.sheet_music_id} onValueChange={(value) => setForm(prev => ({ ...prev, sheet_music_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sheet music" />
                    </SelectTrigger>
                    <SelectContent>
                      {sheetMusic.map(music => (
                        <SelectItem key={music.id} value={music.id}>
                          {music.title} - {music.composer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes about this assignment..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Assign Sheet Music</Button>
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
          <CardTitle>Sheet Music Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Sheet Music</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.member_name}</TableCell>
                  <TableCell>{assignment.sheet_music_title}</TableCell>
                  <TableCell>{format(new Date(assignment.assigned_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.status === 'returned' ? 'default' : assignment.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {assignment.status === 'returned' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {assignment.status === 'assigned' && <Clock className="h-3 w-3 mr-1" />}
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.notes || '-'}</TableCell>
                  <TableCell>
                    {assignment.status === 'assigned' && (
                      <Button 
                        size="sm" 
                        onClick={() => markAsReturned(assignment.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Returned
                      </Button>
                    )}
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
