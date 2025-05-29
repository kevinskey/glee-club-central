import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePDFAnnotationCache } from '@/components/pdf/hooks/usePDFAnnotationCache';

interface Annotation {
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
  const [isLoading, setIsLoading] = useState(false);
  const [undoStack, setUndoStack] = useState<AnnotationData[][]>([]);
  const [redoStack, setRedoStack] = useState<AnnotationData[][]>([]);

  // Use the annotation cache hook
  const {
    getCachedAnnotations,
    updateCachedAnnotations,
    markPageSaved,
    preloadAnnotationsIntoCache,
    clearCache
  } = usePDFAnnotationCache();

  const determineSourceTable = useCallback(async (fileId: string): Promise<'sheet_music' | 'media_library'> => {
    // First check if it exists in sheet_music table
    const { data: sheetMusicData } = await supabase
      .from('sheet_music')
      .select('id')
      .eq('id', fileId)
      .maybeSingle();

    if (sheetMusicData) {
      return 'sheet_music';
    }

    // Check if it exists in media_library table
    const { data: mediaData } = await supabase
      .from('media_library')
      .select('id')
      .eq('id', fileId)
      .maybeSingle();

    if (mediaData) {
      return 'media_library';
    }

    // Default to media_library if neither found (for backwards compatibility)
    return 'media_library';
  }, []);

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

      if (error) {
        console.error('Error loading annotations:', error);
        toast({
          title: "Error",
          description: "Failed to load annotations",
          variant: "destructive"
        });
        return;
      }
      
      setAnnotations(data || []);
      // Preload all annotations into cache for instant access
      preloadAnnotationsIntoCache(data || []);
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
  }, [user, sheetMusicId, toast, preloadAnnotationsIntoCache]);

  // Optimized page annotation loading - uses cache for instant access
  const loadPageAnnotations = useCallback((pageNumber: number) => {
    return getCachedAnnotations(pageNumber);
  }, [getCachedAnnotations]);

  // Get current page annotations directly from cache
  const currentPageAnnotations = useCallback((pageNumber: number) => {
    return getCachedAnnotations(pageNumber);
  }, [getCachedAnnotations]);

  const savePageAnnotations = useCallback(async (
    pageNumber: number,
    annotationData: AnnotationData[]
  ) => {
    if (!user || !sheetMusicId) {
      console.error('Missing user or sheet music ID for saving annotations');
      return;
    }

    // Update cache immediately for instant UI response
    updateCachedAnnotations(pageNumber, annotationData);

    try {
      console.log('Saving annotations for file ID:', sheetMusicId);
      
      // Determine which table the file belongs to
      const sourceTable = await determineSourceTable(sheetMusicId);
      console.log('Determined source table:', sourceTable);

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

        if (error) {
          console.error('Error updating annotation:', error);
          throw error;
        }

        setAnnotations(prev => prev.map(a => 
          a.id === existingAnnotation.id 
            ? { ...a, annotations: annotationData }
            : a
        ));
      } else {
        // Create new annotation with correct source table
        const insertData = {
          user_id: user.id,
          sheet_music_id: sheetMusicId,
          page_number: pageNumber,
          annotation_type: 'mixed',
          annotations: annotationData,
          is_visible: true,
          source_table: sourceTable
        };

        console.log('Inserting new annotation:', insertData);

        const { data, error } = await supabase
          .from('pdf_annotations')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Error creating annotation:', error);
          throw error;
        }

        setAnnotations(prev => [...prev, data]);
      }

      // Mark page as saved in cache
      markPageSaved(pageNumber);
      
      toast({
        title: "Success",
        description: "Annotations saved successfully",
      });
    } catch (error) {
      console.error('Error saving annotations:', error);
      toast({
        title: "Error",
        description: "Failed to save annotations. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, sheetMusicId, annotations, toast, determineSourceTable, updateCachedAnnotations, markPageSaved]);

  const addAnnotation = useCallback((annotation: AnnotationData, pageNumber: number) => {
    const currentAnnotations = getCachedAnnotations(pageNumber);
    
    // Save current state for undo
    setUndoStack(prev => [...prev, currentAnnotations]);
    setRedoStack([]); // Clear redo stack when new action is performed

    // Ensure annotation has an ID
    const annotationWithId = {
      ...annotation,
      id: annotation.id || `annotation-${Date.now()}-${Math.random()}`
    };

    const newAnnotations = [...currentAnnotations, annotationWithId];
    updateCachedAnnotations(pageNumber, newAnnotations);
    savePageAnnotations(pageNumber, newAnnotations);
  }, [getCachedAnnotations, updateCachedAnnotations, savePageAnnotations]);

  const removeAnnotation = useCallback((index: number, pageNumber: number) => {
    const currentAnnotations = getCachedAnnotations(pageNumber);
    
    // Save current state for undo
    setUndoStack(prev => [...prev, currentAnnotations]);
    setRedoStack([]);

    const newAnnotations = currentAnnotations.filter((_, i) => i !== index);
    updateCachedAnnotations(pageNumber, newAnnotations);
    savePageAnnotations(pageNumber, newAnnotations);
  }, [getCachedAnnotations, updateCachedAnnotations, savePageAnnotations]);

  // New function to remove annotation by ID (for eraser tool)
  const removeAnnotationById = useCallback((annotationId: string, pageNumber: number) => {
    const currentAnnotations = getCachedAnnotations(pageNumber);
    
    // Save current state for undo
    setUndoStack(prev => [...prev, currentAnnotations]);
    setRedoStack([]);

    const newAnnotations = currentAnnotations.filter(annotation => 
      annotation.id !== annotationId
    );
    updateCachedAnnotations(pageNumber, newAnnotations);
    savePageAnnotations(pageNumber, newAnnotations);
  }, [getCachedAnnotations, updateCachedAnnotations, savePageAnnotations]);

  const undo = useCallback((pageNumber: number) => {
    if (undoStack.length === 0) return;

    const currentAnnotations = getCachedAnnotations(pageNumber);
    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack(prev => [...prev, currentAnnotations]);
    setUndoStack(newUndoStack);
    updateCachedAnnotations(pageNumber, previousState);
    savePageAnnotations(pageNumber, previousState);
  }, [undoStack, getCachedAnnotations, updateCachedAnnotations, savePageAnnotations]);

  const redo = useCallback((pageNumber: number) => {
    if (redoStack.length === 0) return;

    const currentAnnotations = getCachedAnnotations(pageNumber);
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack(prev => [...prev, currentAnnotations]);
    setRedoStack(newRedoStack);
    updateCachedAnnotations(pageNumber, nextState);
    savePageAnnotations(pageNumber, nextState);
  }, [redoStack, getCachedAnnotations, updateCachedAnnotations, savePageAnnotations]);

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

      updateCachedAnnotations(pageNumber, []);
      setUndoStack([]);
      setRedoStack([]);
      
      toast({
        title: "Success",
        description: "Annotations cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing annotations:', error);
      toast({
        title: "Error",
        description: "Failed to clear annotations",
        variant: "destructive"
      });
    }
  }, [user, sheetMusicId, annotations, toast, updateCachedAnnotations]);

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

  // Clear cache when component unmounts or sheet music changes
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, [sheetMusicId, clearCache]);

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
    removeAnnotationById,
    undo,
    redo,
    clearPageAnnotations,
    toggleAnnotationVisibility,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  };
};
