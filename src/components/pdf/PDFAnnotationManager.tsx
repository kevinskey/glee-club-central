
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFAnnotationToolbar, AnnotationTool } from "../PDFAnnotationToolbar";
import { PDFAnnotationCanvas, Annotation } from "../PDFAnnotationCanvas";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFAnnotationManagerProps {
  showAnnotations: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  user: any;
  sheetMusicId?: string;
  annotations: Annotation[];
  setAnnotations: (annotations: Annotation[]) => void;
}

export const PDFAnnotationManager = ({
  showAnnotations,
  containerRef,
  canvasWidth,
  canvasHeight,
  zoom,
  user,
  sheetMusicId,
  annotations,
  setAnnotations,
}: PDFAnnotationManagerProps) => {
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<AnnotationTool>(null);
  const [penColor, setPenColor] = useState("#FF0000"); // Default to red
  const [penSize, setPenSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();

  if (!showAnnotations) return null;

  const handleAnnotationsChange = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
  };

  const handleClearAnnotations = () => {
    if (window.confirm("Are you sure you want to clear all annotations?")) {
      setAnnotations([]);
    }
  };

  const saveAnnotations = async () => {
    if (!user || !sheetMusicId) {
      toast({
        title: "Cannot save annotations",
        description: "You must be logged in to save annotations.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Convert annotations to a JSON-compatible format
      const annotationsForDB = JSON.parse(JSON.stringify(annotations));
      
      const { data, error } = await supabase
        .from('pdf_annotations')
        .upsert(
          {
            sheet_music_id: sheetMusicId,
            user_id: user.id,
            annotations: annotationsForDB,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'sheet_music_id,user_id' }
        );

      if (error) throw error;

      toast({
        title: "Annotations saved",
        description: "Your annotations have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving annotations:", error);
      toast({
        title: "Error saving annotations",
        description: "There was an error saving your annotations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="annotation-manager-container">
      <PDFAnnotationToolbar
        isOpen={showAnnotations}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onSave={saveAnnotations}
        onClear={handleClearAnnotations}
        penColor={penColor}
        onPenColorChange={setPenColor}
        penSize={penSize}
        onPenSizeChange={setPenSize}
        isMobile={isMobile}
      />
      
      {showAnnotations && (
        <PDFAnnotationCanvas
          containerRef={containerRef}
          activeTool={activeTool}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          penColor={penColor}
          penSize={penSize}
          scale={zoom / 100}
          annotations={annotations}
          onChange={handleAnnotationsChange}
        />
      )}
    </div>
  );
};
