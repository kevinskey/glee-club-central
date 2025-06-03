
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookOpen, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ScrapbookEntry {
  id: string;
  title: string;
  content: string;
  media_embeds: string[];
  created_at: string;
  updated_at: string;
}

export function ScrapbookBuilder() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ScrapbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    media_embeds: ''
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('scrapbook_entries')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching scrapbook entries:', error);
      toast.error('Failed to load scrapbook entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const entryData = {
        title: form.title,
        content: form.content,
        media_embeds: form.media_embeds ? form.media_embeds.split(',').map(url => url.trim()) : [],
        created_by: user?.id
      };

      if (editingId) {
        const { error } = await supabase
          .from('scrapbook_entries')
          .update(entryData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Scrapbook entry updated successfully');
      } else {
        const { error } = await supabase
          .from('scrapbook_entries')
          .insert(entryData);

        if (error) throw error;
        toast.success('Scrapbook entry created successfully');
      }

      resetForm();
      fetchEntries();
    } catch (error) {
      console.error('Error saving scrapbook entry:', error);
      toast.error('Failed to save scrapbook entry');
    }
  };

  const handleEdit = (entry: ScrapbookEntry) => {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      content: entry.content,
      media_embeds: entry.media_embeds.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scrapbook entry?')) return;

    try {
      const { error } = await supabase
        .from('scrapbook_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Scrapbook entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const resetForm = () => {
    setForm({ title: '', content: '', media_embeds: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading scrapbook entries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Entry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {editingId ? 'Edit Scrapbook Entry' : 'Create New Scrapbook Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Entry Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Spring Concert Memories"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content (Markdown supported) *</label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your scrapbook entry here... You can use markdown formatting like **bold** and *italic*"
                  className="min-h-[200px]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports markdown: **bold**, *italic*, ### headings, - lists, etc.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Media Embeds (comma-separated URLs)</label>
                <Textarea
                  value={form.media_embeds}
                  onChange={(e) => setForm(prev => ({ ...prev, media_embeds: e.target.value }))}
                  placeholder="https://example.com/photo1.jpg, https://youtube.com/watch?v=..., https://example.com/photo2.png"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter URLs to photos, videos, or other media to embed in this entry
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Entry
                </Button>
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
          <CardTitle>Scrapbook Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Media Count</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {entry.content.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>{entry.media_embeds.length} items</TableCell>
                  <TableCell>{format(new Date(entry.updated_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
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
