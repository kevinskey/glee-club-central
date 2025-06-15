import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Plus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  document_type: string;
  uploaded_by: string;
  created_at: string;
  description?: string;
}

export function ExecDocumentsSection() {
  const { profile } = useAuth() as { profile: Profile | null };
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'meeting_minutes'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const documentTypes = [
    { value: 'meeting_minutes', label: 'Meeting Minutes' },
    { value: 'policies', label: 'Policies' },
    { value: 'uniform_sheets', label: 'Uniform Sheets' },
    { value: 'reports', label: 'Reports' },
    { value: 'guidelines', label: 'Guidelines' },
    { value: 'other', label: 'Other' }
  ];

  const canUpload = () => {
    return ['President', 'Secretary', 'Business Manager'].includes(profile?.exec_board_role || '');
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('member_uploads')
        .select(`
          id,
          file_name,
          file_url,
          upload_category,
          description,
          created_at,
          member_id,
          profiles!inner(first_name, last_name)
        `)
        .eq('upload_category', 'exec_documents')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDocs = data?.map(doc => ({
        id: doc.id,
        title: doc.file_name.replace(/\.[^/.]+$/, ""), // Remove extension
        file_name: doc.file_name,
        file_url: doc.file_url,
        document_type: 'other',
        uploaded_by:
          Array.isArray(doc.profiles) && doc.profiles[0]
            ? `${doc.profiles[0].first_name ?? ''} ${doc.profiles[0].last_name ?? ''}`.trim()
            : (doc.profiles?.first_name && doc.profiles?.last_name)
                ? `${doc.profiles.first_name} ${doc.profiles.last_name}`
                : 'Unknown',
        created_at: doc.created_at,
        description: doc.description
      })) || [];

      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !formData.title.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `exec-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('member_uploads')
        .insert({
          member_id: profile?.id,
          file_name: formData.title + (fileExt ? `.${fileExt}` : ''),
          file_path: filePath,
          file_url: publicUrl,
          file_type: selectedFile.type,
          upload_category: 'exec_documents',
          description: formData.description
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
      setUploadDialog(false);
      setFormData({ title: '', description: '', document_type: 'meeting_minutes' });
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
        {canUpload() && (
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) => setFormData({ ...formData, document_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">File</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                </div>
                <Button onClick={handleFileUpload} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            {canUpload() && (
              <p className="text-sm">Click "Upload" to add documents</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{doc.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {doc.document_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploaded by {doc.uploaded_by} • {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                  {doc.description && (
                    <p className="text-sm mt-1">{doc.description}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
