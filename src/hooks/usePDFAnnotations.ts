
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Annotation {
  id: string;
  user_id: string;
  sheet_music_id: string;
  page_number: number;
  annotation_type: string;
  annotations: any[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface AnnotationData {
  type: 'pen' | 'highlighter' | 'text' | 'drawing';
  color: string;
  strokeWidth: number;
  points?: number[];
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export const usePDFAnnotations = (sheetMusicId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPageAnnotations, setCurrentPageAnnotations] = useState<AnnotationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [undoStack, setUndoStack] = useState<AnnotationData[][]>([]);
  const [redoStack, setRedoStack] = useState<AnnotationData[][]>([]);

  const loadAnnotations = useCallback(async () => {
    if (!user || !sheetMusicId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pdf_annotations')
        .select('*')
        .eq('user_id', user.id)
        .eq('sheet_music_id', sheetMusicId)
        .order('page_number');

      if (error) throw error;
      setAnnotations(data || []);
    } catch (error) {
      console.error('Error loading annotations:', error);
      toast({
        title: "Error",
        description: "Failed to load annotations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, sheetMusicId, toast]);

  const loadPageAnnotations = useCallback((pageNumber: number) => {
    const pageAnnotation = annotations.find(
      a => a.page_number === pageNumber && a.is_visible
    );
    
    if (pageAnnotation) {
      setCurrentPageAnnotations(pageAnnotation.annotations || []);
    } else {
      setCurrentPageAnnotations([]);
    }
  }, [annotations]);

  const savePageAnnotations = useCallback(async (
    pageNumber: number,
    annotationData: AnnotationData[]
  ) => {
    if (!user || !sheetMusicId) return;

    try {
      const existingAnnotation = annotations.find(a => a.page_number === pageNumber);

      if (existingAnnotation) {
        // Update existing annotation
        const { error } = await supabase
          .from('pdf_annotations')
          .update({
            annotations: annotationData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAnnotation.id);

        if (error) throw error;

        setAnnotations(prev => prev.map(a => 
          a.id === existingAnnotation.id 
            ? { ...a, annotations: annotationData }
            : a
        ));
      } else {
        // Create new annotation
        const { data, error } = await supabase
          .from('pdf_annotations')
          .insert({
            user_id: user.id,
            sheet_music_id: sheetMusicId,
            page_number: pageNumber,
            annotation_type: 'mixed',
            annotations: annotationData,
            is_visible: true
          })
          .select()
          .single();

        if (error) throw error;

        setAnnotations(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error saving annotations:', error);
      toast({
        title: "Error",
        description: "Failed to save annotations",
        variant: "destructive"
      });
    }
  }, [user, sheetMusicId, annotations, toast]);

  const addAnnotation = useCallback((annotation: AnnotationData, pageNumber: number) => {
    // Save current state for undo
    setUndoStack(prev => [...prev, currentPageAnnotations]);
    setRedoStack([]); // Clear redo stack when new action is performed

    const newAnnotations = [...currentPageAnnotations, annotation];
    setCurrentPageAnnotations(newAnnotations);
    savePageAnnotations(pageNumber, newAnnotations);
  }, [currentPageAnnotations, savePageAnnotations]);

  const removeAnnotation = useCallback((index: number, pageNumber: number) => {
    // Save current state for undo
    setUndoStack(prev => [...prev, currentPageAnnotations]);
    setRedoStack([]);

    const newAnnotations = currentPageAnnotations.filter((_, i) => i !== index);
    setCurrentPageAnnotations(newAnnotations);
    savePageAnnotations(pageNumber, newAnnotations);
  }, [currentPageAnnotations, savePageAnnotations]);

  const undo = useCallback((pageNumber: number) => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack(prev => [...prev, currentPageAnnotations]);
    setUndoStack(newUndoStack);
    setCurrentPageAnnotations(previousState);
    savePageAnnotations(pageNumber, previousState);
  }, [undoStack, currentPageAnnotations, savePageAnnotations]);

  const redo = useCallback((pageNumber: number) => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack(prev => [...prev, currentPageAnnotations]);
    setRedoStack(newRedoStack);
    setCurrentPageAnnotations(nextState);
    savePageAnnotations(pageNumber, nextState);
  }, [redoStack, currentPageAnnotations, savePageAnnotations]);

  const clearPageAnnotations = useCallback(async (pageNumber: number) => {
    if (!user || !sheetMusicId) return;

    try {
      const existingAnnotation = annotations.find(a => a.page_number === pageNumber);
      
      if (existingAnnotation) {
        const { error } = await supabase
          .from('pdf_annotations')
          .update({
            annotations: [],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAnnotation.id);

        if (error) throw error;

        setAnnotations(prev => prev.map(a => 
          a.id === existingAnnotation.id 
            ? { ...a, annotations: [] }
            : a
        ));
      }

      setCurrentPageAnnotations([]);
      setUndoStack([]);
      setRedoStack([]);
    } catch (error) {
      console.error('Error clearing annotations:', error);
      toast({
        title: "Error",
        description: "Failed to clear annotations",
        variant: "destructive"
      });
    }
  }, [user, sheetMusicId, annotations, toast]);

  const toggleAnnotationVisibility = useCallback(async (pageNumber: number) => {
    if (!user || !sheetMusicId) return;

    try {
      const existingAnnotation = annotations.find(a => a.page_number === pageNumber);
      
      if (existingAnnotation) {
        const newVisibility = !existingAnnotation.is_visible;
        
        const { error } = await supabase
          .from('pdf_annotations')
          .update({
            is_visible: newVisibility,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAnnotation.id);

        if (error) throw error;

        setAnnotations(prev => prev.map(a => 
          a.id === existingAnnotation.id 
            ? { ...a, is_visible: newVisibility }
            : a
        ));
      }
    } catch (error) {
      console.error('Error toggling annotation visibility:', error);
      toast({
        title: "Error",
        description: "Failed to toggle annotation visibility",
        variant: "destructive"
      });
    }
  }, [user, sheetMusicId, annotations, toast]);

  return {
    annotations,
    currentPageAnnotations,
    isLoading,
    undoStack,
    redoStack,
    loadAnnotations,
    loadPageAnnotations,
    addAnnotation,
    removeAnnotation,
    undo,
    redo,
    clearPageAnnotations,
    toggleAnnotationVisibility,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  };
};
