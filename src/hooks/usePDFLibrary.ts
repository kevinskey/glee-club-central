
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PDFFile {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_url: string;
  file_size?: number;
  voice_part?: string;
  category: string;
  tags?: string[];
  is_public: boolean;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PDFBookmark {
  id: string;
  user_id: string;
  pdf_id: string;
  page_number: number;
  title: string;
  notes?: string;
  created_at: string;
}

export interface PDFAnnotation {
  id: string;
  user_id: string;
  sheet_music_id: string;
  page_number: number;
  annotation_type: string;
  annotations: any[];
  is_visible: boolean;
  source_table: string;
  created_at: string;
  updated_at: string;
}

export function usePDFLibrary() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdf_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPdfFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching PDFs:', err);
      setError(err.message);
      toast.error('Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async (file: File, metadata: {
    title: string;
    description?: string;
    voice_part?: string;
    category?: string;
    tags?: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);

      // Insert record in database
      const { data, error: dbError } = await supabase
        .from('pdf_library')
        .insert({
          title: metadata.title,
          description: metadata.description,
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          voice_part: metadata.voice_part,
          category: metadata.category || 'general',
          tags: metadata.tags || [],
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('PDF uploaded successfully');
      await fetchPDFs();
      return data;
    } catch (err: any) {
      console.error('Error uploading PDF:', err);
      toast.error('Failed to upload PDF');
      throw err;
    }
  };

  const deletePDF = async (pdfId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([filePath]);

      if (storageError) console.warn('Storage delete warning:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('pdf_library')
        .delete()
        .eq('id', pdfId);

      if (dbError) throw dbError;

      toast.success('PDF deleted successfully');
      await fetchPDFs();
    } catch (err: any) {
      console.error('Error deleting PDF:', err);
      toast.error('Failed to delete PDF');
      throw err;
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  return {
    pdfFiles,
    loading,
    error,
    fetchPDFs,
    uploadPDF,
    deletePDF
  };
}

export function usePDFBookmarks(pdfId: string) {
  const [bookmarks, setBookmarks] = useState<PDFBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pdf_bookmarks')
        .select('*')
        .eq('pdf_id', pdfId)
        .eq('user_id', user.id)
        .order('page_number');

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err: any) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (pageNumber: number, title: string, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pdf_bookmarks')
        .insert({
          user_id: user.id,
          pdf_id: pdfId,
          page_number: pageNumber,
          title,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      await fetchBookmarks();
      return data;
    } catch (err: any) {
      console.error('Error adding bookmark:', err);
      toast.error('Failed to add bookmark');
      throw err;
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('pdf_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      await fetchBookmarks();
    } catch (err: any) {
      console.error('Error deleting bookmark:', err);
      toast.error('Failed to delete bookmark');
      throw err;
    }
  };

  useEffect(() => {
    if (pdfId) {
      fetchBookmarks();
    }
  }, [pdfId]);

  return {
    bookmarks,
    loading,
    addBookmark,
    deleteBookmark,
    fetchBookmarks
  };
}

export function usePDFAnnotations(pdfId: string) {
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnotations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pdf_annotations')
        .select('*')
        .eq('sheet_music_id', pdfId)
        .eq('user_id', user.id)
        .order('page_number');

      if (error) throw error;
      setAnnotations(data || []);
    } catch (err: any) {
      console.error('Error fetching annotations:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAnnotations = async (pageNumber: number, annotationData: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pdf_annotations')
        .upsert({
          user_id: user.id,
          sheet_music_id: pdfId,
          page_number: pageNumber,
          annotations: annotationData,
          source_table: 'pdf_library'
        })
        .select()
        .single();

      if (error) throw error;
      await fetchAnnotations();
      return data;
    } catch (err: any) {
      console.error('Error saving annotations:', err);
      toast.error('Failed to save annotations');
      throw err;
    }
  };

  useEffect(() => {
    if (pdfId) {
      fetchAnnotations();
    }
  }, [pdfId]);

  return {
    annotations,
    loading,
    saveAnnotations,
    fetchAnnotations
  };
}
