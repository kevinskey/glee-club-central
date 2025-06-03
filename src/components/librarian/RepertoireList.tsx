
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RepertoireItem {
  id: string;
  title: string;
  composer: string;
  voicing: string | null;
  notes: string | null;
  date_added: string;
}

export function RepertoireList() {
  const { user } = useAuth();
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    composer: '',
    voicing: '',
    notes: ''
  });

  useEffect(() => {
    fetchRepertoire();
  }, []);

  const fetchRepertoire = async () => {
    try {
      const { data, error } = await supabase
        .from('repertoire')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) throw error;
      setRepertoire(data || []);
    } catch (error) {
      console.error('Error fetching repertoire:', error);
      toast.error('Failed to load repertoire');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.composer) {
      toast.error('Please fill in title and composer');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('repertoire')
          .update({
            title: form.title,
            composer: form.composer,
            voicing: form.voicing || null,
            notes: form.notes || null
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Repertoire item updated successfully');
      } else {
        const { error } = await supabase
          .from('repertoire')
          .insert({
            title: form.title,
            composer: form.composer,
            voicing: form.voicing || null,
            notes: form.notes || null,
            added_by: user?.id
          });

        if (error) throw error;
        toast.success('Repertoire item added successfully');
      }

      resetForm();
      fetchRepertoire();
    } catch (error) {
      console.error('Error saving repertoire:', error);
      toast.error('Failed to save repertoire item');
    }
  };

  const handleEdit = (item: RepertoireItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      composer: item.composer,
      voicing: item.voicing || '',
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this repertoire item?')) return;

    try {
      const { error } = await supabase
        .from('repertoire')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Repertoire item deleted successfully');
      fetchRepertoire();
    } catch (error) {
      console.error('Error deleting repertoire:', error);
      toast.error('Failed to delete repertoire item');
    }
  };

  const resetForm = () => {
    setForm({ title: '', composer: '', voicing: '', notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Title', 'Composer', 'Voicing', 'Date Added', 'Notes'],
      ...repertoire.map(item => [
        item.title,
        item.composer,
        item.voicing || '',
        format(new Date(item.date_added), 'yyyy-MM-dd'),
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repertoire-list-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-8">Loading repertoire...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Repertoire Item
        </Button>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Repertoire Item' : 'Add New Repertoire Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Song title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Composer *</label>
                  <Input
                    value={form.composer}
                    onChange={(e) => setForm(prev => ({ ...prev, composer: e.target.value }))}
                    placeholder="Composer name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Voicing</label>
                <Input
                  value={form.voicing}
                  onChange={(e) => setForm(prev => ({ ...prev, voicing: e.target.value }))}
                  placeholder="e.g., SATB, SSA, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this piece..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Add'} Item</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Repertoire Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Composer</TableHead>
                <TableHead>Voicing</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repertoire.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.composer}</TableCell>
                  <TableCell>{item.voicing || '-'}</TableCell>
                  <TableCell>{format(new Date(item.date_added), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
