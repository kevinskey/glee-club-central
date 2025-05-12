
import React from "react";
import { PDFAnnotationCanvas, Annotation } from "@/components/PDFAnnotationCanvas";
import { PDFAnnotationToolbar } from "@/components/PDFAnnotationToolbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";
import { toast } from "sonner";

interface PDFAnnotationManagerProps {
  showAnnotations: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  user: AuthUser | null;
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
  setAnnotations
}: PDFAnnotationManagerProps) => {
  const [activeTool, setActiveTool] = React.useState<"pen" | "eraser" | "square" | null>(null);
  const [penColor, setPenColor] = React.useState("#FF0000");
  const [penSize, setPenSize] = React.useState(3);
  const { toast: toastLegacy } = useToast();

  const handleToolChange = (tool: "pen" | "eraser" | "square" | null) => {
    setActiveTool(tool);
  };

  const handleAnnotationChange = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
  };

  const handleSave = async () => {
    if (!user || !sheetMusicId) {
      toast.error("Cannot save annotations", {
        description: "You must be logged in to save annotations"
      });
      return;
    }

    try {
      // Check if there's an existing entry
      const { data, error: fetchError } = await supabase
        .from('pdf_annotations')
        .select('*')
        .eq('sheet_music_id', sheetMusicId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Convert annotations to a serializable format suitable for Supabase's JSON type
      // Remove any circular references and ensure it's a plain object
      const cleanAnnotations = annotations.map(ann => ({
        id: ann.id,
        type: ann.type,
        points: ann.points ? ann.points.map(p => ({ x: p.x, y: p.y })) : [],
        color: ann.color,
        size: ann.size,
        x: ann.x,
        y: ann.y,
        width: ann.width,
        height: ann.height
      }));
      
      const serializedAnnotations = JSON.parse(JSON.stringify(cleanAnnotations));

      if (data) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('pdf_annotations')
          .update({
            annotations: serializedAnnotations,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);

        if (updateError) throw updateError;
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('pdf_annotations')
          .insert({
            sheet_music_id: sheetMusicId,
            user_id: user.id,
            annotations: serializedAnnotations
          });

        if (insertError) throw insertError;
      }

      toast.success("Annotations saved", {
        description: "Your annotations have been saved successfully"
      });
    } catch (error: any) {
      console.error("Error saving annotations:", error);
      toast.error("Error saving annotations", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all annotations?")) {
      setAnnotations([]);
      toast.message("Annotations cleared", {
        description: "All annotations have been cleared. Save to persist changes."
      });
    }
  };

  if (!showAnnotations) return null;

  return (
    <>
      <PDFAnnotationToolbar
        isOpen={showAnnotations}
        activeTool={activeTool}
        onToolChange={handleToolChange}
        onSave={handleSave}
        onClear={handleClear}
        penColor={penColor}
        onPenColorChange={setPenColor}
        penSize={penSize}
        onPenSizeChange={setPenSize}
        isMobile={false}
      />
      
      <PDFAnnotationCanvas
        containerRef={containerRef}
        activeTool={activeTool}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        penColor={penColor}
        penSize={penSize}
        scale={zoom / 100}
        annotations={annotations}
        onChange={handleAnnotationChange}
      />
    </>
  );
};
