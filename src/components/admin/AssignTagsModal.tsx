
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FanTag, useFanTags } from '@/hooks/useFanTags';
import { toast } from 'sonner';

interface Fan {
  id: string;
  full_name: string;
  email: string;
}

interface AssignTagsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: FanTag[];
}

export function AssignTagsModal({ open, onOpenChange, tags }: AssignTagsModalProps) {
  const [fans, setFans] = useState<Fan[]>([]);
  const [selectedFans, setSelectedFans] = useState<Fan[]>([]);
  const [selectedTags, setSelectedTags] = useState<FanTag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { assignTagsToFans } = useFanTags();

  useEffect(() => {
    if (open) {
      fetchFans();
    }
  }, [open]);

  const fetchFans = async () => {
    try {
      const { data, error } = await supabase
        .from('fans')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setFans(data || []);
    } catch (error) {
      console.error('Error fetching fans:', error);
      toast.error('Failed to load fans');
    }
  };

  const handleAddFan = (fanId: string) => {
    const fan = fans.find(f => f.id === fanId);
    if (fan && !selectedFans.find(f => f.id === fanId)) {
      setSelectedFans([...selectedFans, fan]);
    }
  };

  const handleRemoveFan = (fanId: string) => {
    setSelectedFans(selectedFans.filter(f => f.id !== fanId));
  };

  const handleAddTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && !selectedTags.find(t => t.id === tagId)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFans.length === 0 || selectedTags.length === 0) return;

    setIsSubmitting(true);
    try {
      const fanIds = selectedFans.map(f => f.id);
      const tagLabels = selectedTags.map(t => t.label);
      
      const success = await assignTagsToFans(fanIds, tagLabels);
      if (success) {
        setSelectedFans([]);
        setSelectedTags([]);
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedFans([]);
    setSelectedTags([]);
    onOpenChange(false);
  };

  const availableFans = fans.filter(fan => 
    !selectedFans.find(selected => selected.id === fan.id)
  );

  const availableTags = tags.filter(tag => 
    !selectedTags.find(selected => selected.id === tag.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Tags to Fans</DialogTitle>
          <DialogDescription>
            Select fans and tags to assign. Tags will be added to the selected fans.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fan Selection */}
          <div>
            <Label>Select Fans</Label>
            <Select onValueChange={handleAddFan}>
              <SelectTrigger>
                <SelectValue placeholder="Choose fans to tag..." />
              </SelectTrigger>
              <SelectContent>
                {availableFans.map((fan) => (
                  <SelectItem key={fan.id} value={fan.id}>
                    {fan.full_name} ({fan.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFans.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFans.map((fan) => (
                  <Badge key={fan.id} variant="secondary" className="pr-1">
                    {fan.full_name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveFan(fan.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tag Selection */}
          <div>
            <Label>Select Tags</Label>
            <Select onValueChange={handleAddTag}>
              <SelectTrigger>
                <SelectValue placeholder="Choose tags to assign..." />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.label}
                    {tag.description && ` - ${tag.description}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="pr-1">
                    {tag.label}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveTag(tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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
              disabled={selectedFans.length === 0 || selectedTags.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Tags'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
