
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "@/components/PDFViewer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  arranger?: string;
  voice_part?: string;
  file_url: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
}

export default function ViewSheetMusicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [music, setMusic] = useState<SheetMusic | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSheetMusic = async () => {
      if (!id) {
        navigate("/dashboard/sheet-music");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sheet_music")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setMusic(data as SheetMusic);
        } else {
          toast({
            title: "Not found",
            description: "The requested sheet music could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard/sheet-music");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load sheet music.",
          variant: "destructive",
        });
        navigate("/dashboard/sheet-music");
      } finally {
        setLoading(false);
      }
    };

    fetchSheetMusic();
  }, [id, toast, navigate]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!music) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className={`mb-2 flex items-center justify-between flex-wrap gap-2 ${isMobile ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="truncate">{music.title}</span>
          <span className="text-muted-foreground font-normal text-sm md:text-base truncate">
            by {music.composer}
          </span>
        </h1>
      </div>
      <PDFViewer 
        url={music.file_url} 
        title={`${music.title} by ${music.composer}`} 
      />
    </div>
  );
}
