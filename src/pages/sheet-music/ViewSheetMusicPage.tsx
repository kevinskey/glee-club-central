
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "@/components/PDFViewer";
import { useToast } from "@/hooks/use-toast";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
}

export default function ViewSheetMusicPage() {
  const { id } = useParams();
  const [music, setMusic] = useState<SheetMusic | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSheetMusic() {
      try {
        const { data, error } = await supabase
          .from('sheet_music')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Sheet music not found",
            description: "The requested sheet music could not be found.",
            variant: "destructive",
          });
          navigate('/dashboard/sheet-music');
          return;
        }

        setMusic(data as SheetMusic);
      } catch (error: any) {
        console.error("Error fetching sheet music:", error);
        toast({
          title: "Error",
          description: "Failed to load sheet music. Please try again later.",
          variant: "destructive",
        });
        navigate('/dashboard/sheet-music');
      } finally {
        setLoading(false);
      }
    }

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
    <div className="container px-0 md:px-8 py-4 md:py-8">
      <PDFViewer 
        url={music.file_url} 
        title={`${music.title} by ${music.composer}`} 
      />
    </div>
  );
}
