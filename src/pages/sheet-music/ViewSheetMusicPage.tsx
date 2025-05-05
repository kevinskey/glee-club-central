// Modifications to pass the current sheet music ID to SetlistDrawer
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ListMusic } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
}

export default function ViewSheetMusicPage() {
  const { id: sheetMusicId } = useParams();
  const params = useParams();
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [sheetMusic, setSheetMusic] = useState<SheetMusic | null>(null);
  
  // Add state for setlist drawer
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (!params.id) {
      toast({
        title: "Missing sheet music ID",
        description: "Please select a sheet music to view",
        variant: "destructive",
      });
      return;
    }

    const fetchSheetMusic = async () => {
      try {
        const { data, error } = await supabase
          .from('sheet_music')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setSheetMusic(data as SheetMusic);
        }
      } catch (error: any) {
        console.error("Error fetching sheet music:", error);
        toast({
          title: "Error loading sheet music",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchSheetMusic();
  }, [params.id, toast]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
    setNumPages(nextNumPages);
  }

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link to="/dashboard/sheet-music" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Music Library
        </Link>
      </Button>
        
      {/* This is where the setlist drawer would be added */}
      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
        currentSheetMusicId={params.id}
      />
      
      {sheetMusic === null ? (
        <p>Loading sheet music...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{sheetMusic.title}</h1>
              <p className="text-muted-foreground">{sheetMusic.composer}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSetlistDrawerOpen(true)}
              >
                <ListMusic className="h-4 w-4 mr-2" /> Add to Setlist
              </Button>
              <a href={sheetMusic.file_url} target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </a>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Document
              file={sheetMusic.file_url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-full"
            >
              <Page pageNumber={pageNumber} width={1000} />
            </Document>
            <div className="flex items-center justify-center space-x-4 py-2 bg-gray-100">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {pageNumber} of {numPages || "--"}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={numPages ? pageNumber >= numPages : true}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
