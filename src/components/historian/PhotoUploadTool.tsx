
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

export function PhotoUploadTool() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    event_date: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error('Please select only JPG or PNG files');
        return;
      }
      
      setSelectedFiles(files);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }

    if (!form.title) {
      toast.error('Please provide a title');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `photo-${Date.now()}-${index}.${fileExt}`;
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('historian-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('historian-photos')
          .getPublicUrl(fileName);

        // Save to media_library table
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: `${form.title}${selectedFiles.length > 1 ? ` (${index + 1})` : ''}`,
            description: form.description || null,
            file_type: 'image',
            file_url: urlData.publicUrl,
            file_path: fileName,
            folder: 'historian-photos',
            tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [],
            uploaded_by: user?.id,
            size: file.size
          });

        if (dbError) throw dbError;

        return { success: true, fileName };
      });

      await Promise.all(uploadPromises);

      toast.success(`Successfully uploaded ${selectedFiles.length} photo(s)`);
      
      // Reset form
      setForm({ title: '', description: '', tags: '', event_date: '' });
      setSelectedFiles(null);
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Upload Photos (JPG, PNG)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Photo Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Spring Concert 2024"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of the photos..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="concert, performance, rehearsal"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Event Date</label>
                <Input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm(prev => ({ ...prev, event_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Select Photos *</label>
              <Input
                id="photo-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-glee-spelman file:text-white hover:file:bg-glee-spelman/90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select one or more JPG/PNG files. Multiple files will be numbered automatically.
              </p>
            </div>

            {selectedFiles && (
              <div className="text-sm text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </div>
            )}

            <Button type="submit" disabled={uploading} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
