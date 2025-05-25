
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Music, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  file_name: string;
  file_url: string;
  file_path: string;
  upload_category: string;
  description: string;
  created_at: string;
}

export const MemberUploadPortal: React.FC = () => {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadCategories = [
    { value: 'audition', label: 'Solo Audition', icon: Music },
    { value: 'form', label: 'Required Forms', icon: FileText },
    { value: 'survey', label: 'Survey Response', icon: Heart }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload PDF, audio (MP3/WAV), or video (MP4/MOV) files only');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !category || !profile?.id) {
      toast.error('Please select a file, category, and provide a description');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${profile.id}/${category}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage (we'll use media_library bucket for now)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media_library')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media_library')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('member_uploads')
        .insert({
          member_id: profile.id,
          file_name: selectedFile.name,
          file_path: fileName,
          file_url: urlData.publicUrl,
          file_type: selectedFile.type,
          upload_category: category,
          description: description.trim()
        });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully');
      
      // Reset form
      setSelectedFile(null);
      setCategory('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload uploaded files
      loadUploadedFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const loadUploadedFiles = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('member_uploads')
        .select('*')
        .eq('member_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedFiles(data || []);
    } catch (error) {
      console.error('Error loading uploaded files:', error);
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage
        .from('media_library')
        .remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('member_uploads')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast.success('File deleted successfully');
      loadUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  React.useEffect(() => {
    if (profile?.id) {
      loadUploadedFiles();
    }
  }, [profile?.id]);

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload solo auditions, required forms, or survey responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select upload category..." />
              </SelectTrigger>
              <SelectContent>
                {uploadCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Select File *</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.mp3,.wav,.mp4,.mov"
              onChange={handleFileSelect}
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, MP3, WAV, MP4, MOV (max 10MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about this upload..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !category || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Uploaded Files</CardTitle>
          <CardDescription>
            View and manage your previously uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const categoryInfo = uploadCategories.find(cat => cat.value === file.upload_category);
                const CategoryIcon = categoryInfo?.icon || FileText;

                return (
                  <div key={file.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <CategoryIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{file.file_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {categoryInfo?.label} • Uploaded {new Date(file.created_at).toLocaleDateString()}
                        </p>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id, file.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
