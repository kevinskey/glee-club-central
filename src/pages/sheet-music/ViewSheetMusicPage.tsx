import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ListMusic, TableIcon, Bookmark, BookmarkPlus, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { PDFViewer } from "@/components/PDFViewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Metronome } from "@/components/ui/metronome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  voicing?: string;
  tags?: string[];
  description?: string;
  category?: string;
}

export default function ViewSheetMusicPage() {
  const { id: sheetMusicId } = useParams();
  const { toast: toastLegacy } = useToast(); // Rename to avoid conflict with sonner
  const navigate = useNavigate();
  const location = useLocation();
  const [sheetMusic, setSheetMusic] = useState<SheetMusic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // ForScore-like features
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetails, setShowDetails] = useState(!isMobile);
  
  // Add state for setlist drawer
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  
  // BPM for metronome
  const [bpm, setBpm] = useState(100);
  
  const fileFromLocation = location.state?.file;
  const fromMediaLibrary = location.state?.fromMediaLibrary;
  
  useEffect(() => {
    // If we have the file data from navigation state, use it directly
    if (fileFromLocation) {
      setSheetMusic(fileFromLocation);
      setIsLoading(false);
      return;
    }
    
    if (!sheetMusicId) {
      toastLegacy({
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
        // Try to fetch from media library first
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_library')
          .select('*')
          .eq('id', sheetMusicId)
          .maybeSingle();
          
        if (mediaData) {
          setSheetMusic({
            id: mediaData.id,
            title: mediaData.title,
            composer: mediaData.description || "Unknown",
            file_url: mediaData.file_url,
            voicing: mediaData.folder,
            tags: mediaData.tags,
            description: mediaData.description,
            category: mediaData.folder
          });
          setIsLoading(false);
          return;
        }
        
        // If not in media library, try sheet_music table
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
          toastLegacy({
            title: "Sheet music not found",
            description: "The requested sheet music could not be found",
            variant: "destructive",
          });
          navigate("/dashboard/sheet-music");
        }
      } catch (error: any) {
        console.error("Error fetching sheet music:", error);
        toastLegacy({
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
  }, [sheetMusicId, toastLegacy, navigate, fileFromLocation, fromMediaLibrary]);
  
  // Check if already bookmarked (from localStorage)
  useEffect(() => {
    if (sheetMusicId) {
      const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedSheetMusic') || '[]');
      setIsBookmarked(bookmarkedIds.includes(sheetMusicId));
    }
  }, [sheetMusicId]);
  
  // Toggle bookmark
  const toggleBookmark = () => {
    if (!sheetMusicId) return;
    
    const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedSheetMusic') || '[]');
    let newBookmarkedIds;
    
    if (isBookmarked) {
      newBookmarkedIds = bookmarkedIds.filter((id: string) => id !== sheetMusicId);
      toast.message("Bookmark removed", {
        description: "Sheet music removed from bookmarks"
      });
    } else {
      newBookmarkedIds = [...bookmarkedIds, sheetMusicId];
      toast.message("Bookmarked", {
        description: "Sheet music added to bookmarks"  
      });
    }
    
    localStorage.setItem('bookmarkedSheetMusic', JSON.stringify(newBookmarkedIds));
    setIsBookmarked(!isBookmarked);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreenMode = () => {
    setIsFullscreenMode(!isFullscreenMode);
    setShowDetails(false);
  };

  // Toggle metronome with safety
  const toggleMetronome = () => {
    // If turning on, inform user about sound
    if (!isMetronomeActive) {
      // Using the proper Sonner toast syntax
      toast.message("Starting metronome - ensure your volume is on");
    }
    setIsMetronomeActive(!isMetronomeActive);
  };

  return (
    <div className={`space-y-4 ${isFullscreenMode ? 'fixed inset-0 z-50 bg-background p-0' : ''}`}>
      {!isFullscreenMode && (
        <div className="flex items-center justify-between mb-2">
          <Button asChild variant="ghost">
            <Link to="/dashboard/sheet-music" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Music Library
            </Link>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant={showDetails ? "default" : "outline"}
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className={showDetails ? "bg-glee-purple hover:bg-glee-purple/90" : ""}
            >
              <TableIcon className="mr-2 h-4 w-4" />
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
            
            <Button 
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={toggleBookmark}
              className={isBookmarked ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              {isBookmarked ? (
                <Bookmark className="mr-2 h-4 w-4" />
              ) : (
                <BookmarkPlus className="mr-2 h-4 w-4" />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSetlistDrawerOpen(true)}
            >
              <ListMusic className="mr-2 h-4 w-4" />
              Add to Setlist
            </Button>
          </div>
        </div>
      )}
        
      {/* Setlist drawer component */}
      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
        currentSheetMusicId={sheetMusicId}
      />
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Music details panel */}
        {showDetails && !isLoading && sheetMusic && (
          <div className="lg:w-1/4 xl:w-1/5 p-4 border rounded-lg">
            <h2 className="text-lg font-bold mb-4">Music Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <p className="font-semibold">{sheetMusic.title}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Composer</Label>
                <p>{sheetMusic.composer}</p>
              </div>
              
              {sheetMusic.voicing && (
                <div>
                  <Label className="text-xs text-muted-foreground">Voicing/Category</Label>
                  <p>{sheetMusic.voicing}</p>
                </div>
              )}
              
              {sheetMusic.description && (
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{sheetMusic.description}</p>
                </div>
              )}
              
              {sheetMusic.tags && sheetMusic.tags.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sheetMusic.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* ForScore-like tools */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">Performance Tools</h3>
                
                <Tabs defaultValue="metronome" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="metronome" className="w-full">Metronome</TabsTrigger>
                    <TabsTrigger value="tuner" className="w-full">Tuner</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metronome" className="p-2 mt-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bpm">Tempo (BPM): {bpm}</Label>
                        <input
                          id="bpm"
                          type="range"
                          min="40"
                          max="208"
                          value={bpm}
                          onChange={(e) => setBpm(parseInt(e.target.value))}
                          className="w-32"
                        />
                      </div>
                      <Button
                        variant={isMetronomeActive ? "destructive" : "outline"}
                        size="sm"
                        onClick={toggleMetronome}
                        className="w-full"
                      >
                        <Music className="h-4 w-4 mr-2" />
                        {isMetronomeActive ? "Stop Metronome" : "Start Metronome"}
                      </Button>
                      
                      {/* Hidden metronome component that plays when active */}
                      <Metronome bpm={bpm} isPlaying={isMetronomeActive} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tuner" className="pt-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['A3', 'B♭3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'].map(note => (
                        <Button 
                          key={note} 
                          variant="outline"
                          size="sm"
                          className="w-12 h-12 flex flex-col items-center justify-center p-0"
                          onClick={() => {
                            // Play note sound (would normally use Tone.js or similar)
                            toast({
                              title: `Playing ${note}`,
                              description: "Pitch reference tone"
                            });
                          }}
                        >
                          <span className="text-sm font-bold">{note.replace(/\d+/, '')}</span>
                          <span className="text-xs text-muted-foreground">{note.match(/\d+/)?.[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Download button */}
              <div className="pt-4">
                <a href={sheetMusic.file_url} download target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm" className="w-full bg-glee-purple hover:bg-glee-purple/90">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PDF viewer with enhanced features */}
        <div className={`${showDetails ? 'lg:w-3/4 xl:w-4/5' : 'w-full'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading sheet music...</p>
            </div>
          ) : sheetMusic === null ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Sheet music not found</p>
            </div>
          ) : (
            <PDFViewer 
              url={sheetMusic.file_url} 
              title={sheetMusic.title}
              sheetMusicId={sheetMusicId}
              fullHeight={isFullscreenMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
