import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ListMusic, ChevronLeft, ChevronRight, X, Maximize, Minimize } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "@/components/PDFViewer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Setlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  sheet_music_ids: string[];
}

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
}

export default function ViewSetlistPage() {
  const { id: setlistId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [setlistItems, setSetlistItems] = useState<SheetMusic[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Determine if we're in the dashboard layout or standalone fullscreen mode
  const isInDashboard = location.pathname.includes('/dashboard/');

  useEffect(() => {
    if (!setlistId) {
      toast({
        title: "Missing setlist ID",
        description: "Please select a setlist to view",
        variant: "destructive",
      });
      navigate("/dashboard/setlists");
      return;
    }

    const loadSetlist = async () => {
      setIsLoading(true);
      try {
        // Fetch the setlist
        const { data: setlistData, error: setlistError } = await supabase
          .from('setlists')
          .select('*')
          .eq('id', setlistId)
          .maybeSingle();

        if (setlistError) throw setlistError;

        if (!setlistData) {
          toast({
            title: "Setlist not found",
            description: "The requested setlist could not be found",
            variant: "destructive",
          });
          navigate("/dashboard/setlists");
          return;
        }

        setSetlist(setlistData as Setlist);

        // If setlist has no items, show message and return
        if (!setlistData.sheet_music_ids || setlistData.sheet_music_ids.length === 0) {
          setSetlistItems([]);
          setIsLoading(false);
          return;
        }

        // Fetch all sheet music items
        const { data: musicItems, error: musicError } = await supabase
          .from('sheet_music')
          .select('id, title, composer, file_url')
          .in('id', setlistData.sheet_music_ids);

        if (musicError) throw musicError;

        if (musicItems) {
          // Order the items according to the order in setlist.sheet_music_ids
          const orderedItems = setlistData.sheet_music_ids
            .map(id => musicItems.find(item => item.id === id))
            .filter(Boolean) as SheetMusic[];
          
          setSetlistItems(orderedItems);
        }
      } catch (error) {
        console.error("Error loading setlist:", error);
        toast({
          title: "Failed to load setlist",
          description: "There was a problem loading the setlist. Please try again.",
          variant: "destructive",
        });
        navigate("/dashboard/setlists");
      } finally {
        setIsLoading(false);
      }
    };

    loadSetlist();
  }, [setlistId, toast, navigate]);

  const goToNext = () => {
    if (currentIndex < setlistItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading setlist...</p>
      </div>
    );
  }

  if (!setlist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Setlist not found</p>
      </div>
    );
  }

  if (setlistItems.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost">
            <Link to="/dashboard/setlists" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Setlists
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ListMusic className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">{setlist.name}</h2>
          <p className="text-muted-foreground mb-4">This setlist is empty.</p>
          <Button 
            onClick={() => navigate('/dashboard/sheet-music')}
            variant="default"
          >
            Browse Sheet Music
          </Button>
        </div>
      </div>
    );
  }

  const currentItem = setlistItems[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-background relative">
      {/* Header (hidden in fullscreen mode) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link to={isInDashboard ? "/dashboard/setlists" : "/dashboard"}>
                <X className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">{setlist?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {setlistItems.length}: {setlistItems[currentIndex]?.title}
              </p>
            </div>
          </div>
          <Button 
            onClick={toggleFullscreen} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" /> Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" /> Fullscreen
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-grow relative">
        {setlistItems[currentIndex] && (
          <PDFViewer 
            url={setlistItems[currentIndex].file_url} 
            title={setlistItems[currentIndex].title}
            sheetMusicId={setlistItems[currentIndex].id}
            fullHeight={true}
          />
        )}
      </div>

      {/* Navigation controls (always visible) */}
      <div className={`flex items-center justify-between p-4 ${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm' : 'border-t'}`}>
        <Button 
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 text-center">
          {isFullscreen && (
            <p className="text-sm font-medium mb-1">{setlist.name}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {setlistItems.length}: {setlistItems[currentIndex]?.title}
          </p>
        </div>

        <Button 
          onClick={goToNext}
          disabled={currentIndex === setlistItems.length - 1}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Fullscreen toggle button (only shown in fullscreen mode) */}
      {isFullscreen && (
        <Button 
          onClick={toggleFullscreen} 
          variant="outline" 
          size="icon"
          className="rounded-full absolute top-4 right-4 bg-background/80"
        >
          <Minimize className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
