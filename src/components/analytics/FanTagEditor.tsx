
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Fan {
  id: string;
  full_name: string;
  email: string;
  tags?: string[];
  notes?: string;
}

interface FanTagEditorProps {
  fan: Fan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fanId: string, tags: string[], notes: string) => Promise<void>;
}

export function FanTagEditor({ fan, isOpen, onClose, onSave }: FanTagEditorProps) {
  const [tags, setTags] = useState<string[]>(fan?.tags || []);
  const [notes, setNotes] = useState(fan?.notes || '');
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (fan) {
      setTags(fan.tags || []);
      setNotes(fan.notes || '');
    }
  }, [fan]);

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!fan) return;
    
    setIsLoading(true);
    try {
      await onSave(fan.id, tags, notes);
      toast.success('Fan details updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating fan:', error);
      toast.error('Failed to update fan details');
    } finally {
      setIsLoading(false);
    }
  };

  const commonTags = ['alumni', 'buyer', 'rsvp-spring', 'rsvp-fall', 'donor', 'vip', 'social-media'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Fan Details</DialogTitle>
          <DialogDescription>
            Update tags and notes for {fan?.full_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Tags */}
          <div>
            <Label className="text-sm font-medium">Current Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <span className="text-muted-foreground text-sm">No tags added yet</span>
              )}
            </div>
          </div>

          {/* Add New Tag */}
          <div>
            <Label className="text-sm font-medium">Add New Tag</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter tag name..."
                className="flex-1"
              />
              <Button onClick={addTag} size="sm" disabled={!newTag.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Common Tags */}
          <div>
            <Label className="text-sm font-medium">Quick Add</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonTags
                .filter(tag => !tags.includes(tag))
                .map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => setTags([...tags, tag])}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this fan..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
