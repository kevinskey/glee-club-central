
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TreasurerNote {
  id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function TreasurerNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<TreasurerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('treasurer_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching treasurer notes:', error);
      toast.error('Failed to load treasurer notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!noteContent.trim()) {
      toast.error('Please enter some content for the note');
      return;
    }

    try {
      if (editingId) {
        // Update existing note
        const { error } = await supabase
          .from('treasurer_notes')
          .update({ content: noteContent })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Note updated successfully');
      } else {
        // Create new note
        const { error } = await supabase
          .from('treasurer_notes')
          .insert({
            content: noteContent,
            created_by: user?.id
          });

        if (error) throw error;
        toast.success('Note created successfully');
      }

      setNoteContent('');
      setEditingId(null);
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleEdit = (note: TreasurerNote) => {
    setEditingId(note.id);
    setNoteContent(note.content);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('treasurer_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleCancel = () => {
    setNoteContent('');
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Note Button */}
      <div className="flex justify-start">
        <Button onClick={() => setShowForm(!showForm)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          {editingId ? 'Edit Note' : 'Add Note'}
        </Button>
      </div>

      {/* Note Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Note' : 'Create New Note'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Note Content</label>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter your treasurer note here... You can use markdown formatting."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports basic markdown formatting (bold, italic, lists, etc.)
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Note' : 'Save Note'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No notes yet. Create your first treasurer note to get started.
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(note.created_at), 'MMM dd, yyyy')}
                      {note.updated_at !== note.created_at && (
                        <span> • Updated {format(new Date(note.updated_at), 'MMM dd, yyyy')}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note)}
                      disabled={showForm}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={showForm}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {/* Simple markdown-like rendering */}
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {note.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
