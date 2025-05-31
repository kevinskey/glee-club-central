
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFanTags } from '@/hooks/useFanTags';

interface CreateTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTagModal({ open, onOpenChange, onSuccess }: CreateTagModalProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTag } = useFanTags();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await createTag(label.trim(), description.trim() || undefined);
      if (success) {
        setLabel('');
        setDescription('');
        onOpenChange(false);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLabel('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Add a new tag that can be assigned to fans for organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tag-label">Tag Name *</Label>
            <Input
              id="tag-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter tag name"
              required
            />
          </div>
          <div>
            <Label htmlFor="tag-description">Description</Label>
            <Textarea
              id="tag-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter tag description (optional)"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!label.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
