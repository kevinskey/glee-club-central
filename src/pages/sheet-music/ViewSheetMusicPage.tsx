
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ListMusic, TableIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { PDFViewer } from "@/components/PDFViewer";
import { useIsMobile } from "@/hooks/use-mobile";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
}

export default function ViewSheetMusicPage() {
  const { id: sheetMusicId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sheetMusic, setSheetMusic] = useState<SheetMusic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Add state for setlist drawer
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (!sheetMusicId) {
      toast({
        title: "Missing sheet music ID",
        description: "Please select a sheet music to view",
        variant: "destructive",
      });
      navigate("/dashboard/sheet-music");
      return;
    }

    const fetchSheetMusic = async () => {
      setIsLoading(true);
      try {
        // Use maybeSingle instead of single to avoid errors when no data is found
        const { data, error } = await supabase
          .from('sheet_music')
          .select('*')
          .eq('id', sheetMusicId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSheetMusic(data as SheetMusic);
        } else {
          // Handle case where sheet music is not found
          toast({
            title: "Sheet music not found",
            description: "The requested sheet music could not be found",
            variant: "destructive",
          });
          navigate("/dashboard/sheet-music");
        }
      } catch (error: any) {
        console.error("Error fetching sheet music:", error);
        toast({
          title: "Error loading sheet music",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        navigate("/dashboard/sheet-music");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetMusic();
  }, [sheetMusicId, toast, navigate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Button asChild variant="ghost">
          <Link to="/dashboard/sheet-music" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Music Library
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/sheet-music?view=list" className="flex items-center">
              <TableIcon className="mr-2 h-4 w-4" />
              Table View
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/setlists" className="flex items-center">
              <ListMusic className="mr-2 h-4 w-4" />
              View Setlists
            </Link>
          </Button>
        </div>
      </div>
        
      {/* Setlist drawer component */}
      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
        currentSheetMusicId={sheetMusicId}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading sheet music...</p>
        </div>
      ) : sheetMusic === null ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Sheet music not found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-2`}>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{sheetMusic.title}</h1>
              <p className="text-muted-foreground">{sheetMusic.composer}</p>
            </div>
            <div className={`flex items-center ${isMobile ? 'mt-2 justify-end' : ''} space-x-2`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSetlistDrawerOpen(true)}
              >
                <ListMusic className="h-4 w-4 mr-2" /> Add to Setlist
              </Button>
              <a href={sheetMusic.file_url} download target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="sm" className="bg-glee-purple hover:bg-glee-purple/90">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </a>
            </div>
          </div>
          
          {/* Use the PDFViewer component */}
          <PDFViewer 
            url={sheetMusic.file_url} 
            title={sheetMusic.title}
            sheetMusicId={sheetMusicId}
          />
        </div>
      )}
    </div>
  );
}
