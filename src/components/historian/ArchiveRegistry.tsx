
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
import { Plus, Archive, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ArchiveEntry {
  id: string;
  venue: string;
  event_date: string;
  event_type: string;
  program_uploaded: boolean;
  notes: string | null;
  created_at: string;
}

export function ArchiveRegistry() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    venue: '',
    event_date: '',
    event_type: 'concert',
    program_uploaded: false,
    notes: ''
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('archive_registry')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching archive entries:', error);
      toast.error('Failed to load archive registry');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.venue || !form.event_date) {
      toast.error('Please fill in venue and event date');
      return;
    }

    try {
      const { error } = await supabase
        .from('archive_registry')
        .insert({
          venue: form.venue,
          event_date: form.event_date,
          event_type: form.event_type,
          program_uploaded: form.program_uploaded,
          notes: form.notes || null,
          created_by: user?.id
        });

      if (error) throw error;

      setForm({ venue: '', event_date: '', event_type: 'concert', program_uploaded: false, notes: '' });
      setShowForm(false);
      fetchEntries();
      toast.success('Archive entry added successfully');
    } catch (error) {
      console.error('Error adding archive entry:', error);
      toast.error('Failed to add archive entry');
    }
  };

  const toggleProgramStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('archive_registry')
        .update({ program_uploaded: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchEntries();
      toast.success('Program status updated');
    } catch (error) {
      console.error('Error updating program status:', error);
      toast.error('Failed to update program status');
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Venue', 'Event Date', 'Event Type', 'Program Uploaded', 'Notes'],
      ...entries.map(entry => [
        entry.venue,
        format(new Date(entry.event_date), 'yyyy-MM-dd'),
        entry.event_type,
        entry.program_uploaded ? 'Yes' : 'No',
        entry.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive-registry-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-8">Loading archive registry...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Archive Entry
        </Button>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Add Archive Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Venue *</label>
                  <Input
                    value={form.venue}
                    onChange={(e) => setForm(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g., Morehouse College"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Event Date *</label>
                  <Input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm(prev => ({ ...prev, event_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Type</label>
                  <Select value={form.event_type} onValueChange={(value) => setForm(prev => ({ ...prev, event_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="masterclass">Masterclass</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="program-uploaded"
                    checked={form.program_uploaded}
                    onChange={(e) => setForm(prev => ({ ...prev, program_uploaded: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="program-uploaded" className="text-sm font-medium">
                    Program Uploaded
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this event..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Entry</Button>
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
          <CardTitle>Archive Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Program Uploaded?</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.venue}</TableCell>
                  <TableCell>{format(new Date(entry.event_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="capitalize">{entry.event_type}</TableCell>
                  <TableCell>
                    <Badge variant={entry.program_uploaded ? 'default' : 'destructive'}>
                      {entry.program_uploaded ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.notes || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProgramStatus(entry.id, entry.program_uploaded)}
                    >
                      Toggle Program
                    </Button>
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
