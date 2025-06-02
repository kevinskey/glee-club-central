
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, DialogTrigger as AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowUp, ArrowDown, Edit, Eye, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HeroImage {
  id: string;
  name: string;
  description?: string;
  file_url: string;
  position: number;
}

interface HeroImageCardProps {
  image: HeroImage;
  index: number;
  totalImages: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function HeroImageCard({ 
  image, 
  index, 
  totalImages, 
  onMove, 
  onDelete, 
  onUpdate 
}: HeroImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: image.name,
    description: image.description || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!editData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_images')
        .update({
          name: editData.name.trim(),
          description: editData.description.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', image.id);

      if (error) throw error;

      toast.success('Hero image updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating hero image:', error);
      toast.error('Failed to update hero image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: image.name,
      description: image.description || ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(image.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img
              src={image.file_url}
              alt={image.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
              }}
            />
          </AspectRatio>
          
          {/* Position badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              #{index + 1}
            </Badge>
          </div>

          {/* Quick action buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/90 hover:bg-white" 
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/90 hover:bg-white" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Move buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/90 hover:bg-white" 
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/90 hover:bg-white" 
              onClick={() => onMove(index, 'down')}
              disabled={index === totalImages - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          {!isEditing ? (
            <>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h5 className="font-medium truncate flex-1">{image.name}</h5>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="shrink-0"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              {image.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {image.description}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Hero image name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  <Save className="h-3 w-3 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview: {image.name}</DialogTitle>
            {image.description && (
              <DialogDescription>{image.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-lg border">
            <img
              src={image.file_url}
              alt={image.name}
              className="w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Hero Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{image.name}" from the hero slideshow? 
              This action cannot be undone. The image will remain in your media library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove from Hero
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
