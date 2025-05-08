import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Search, Plus, Upload, FolderOpen, ListMusic, Check, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { MultipleDownloadBar } from "@/components/sheet-music/MultipleDownloadBar";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
}

export default function SheetMusicPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SheetMusic[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultView = searchParams.get("view") === "list" ? "list" : "grid";

  // Fetch sheet music data
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display
        const formattedData = data.map((item: SheetMusic) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setMusicFiles(formattedData);
        setFilteredFiles(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching sheet music:", error);
      toast({
        title: "Error loading sheet music",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSheetMusic();
  }, []);

  // Filter music files based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredFiles(
        musicFiles.filter(
          file => 
            file.title.toLowerCase().includes(query) || 
            file.composer.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredFiles(musicFiles);
    }
  }, [searchQuery, musicFiles]);

  // Toggle file selection
  const toggleFileSelection = (file: SheetMusic) => {
    setSelectedFiles(prevSelected => {
      // Check if the file is already selected by comparing IDs
      const isSelected = prevSelected.some(item => item.id === file.id);
      
      if (isSelected) {
        // Remove from selection
        return prevSelected.filter(item => item.id !== file.id);
      } else {
        // Add to selection
        return [...prevSelected, file];
      }
    });
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedFiles([]);
    setIsSelectionMode(false);
  };

  // Check if a file is selected
  const isFileSelected = (fileId: string) => {
    return selectedFiles.some(file => file.id === fileId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sheet Music Library"
        description="Browse, view, and annotate your sheet music"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <>
            {!isSelectionMode && (
              <Button 
                variant="outline"
                onClick={() => setIsSelectionMode(true)}
                className="gap-2 mr-2"
              >
                <Check className="h-4 w-4" /> Select Multiple
              </Button>
            )}
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> Upload PDF
            </Button>
          </>
        }
      />

      {/* Search bar and view toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sheet music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-shrink-0"
            onClick={() => setIsSetlistDrawerOpen(true)}
          >
            <ListMusic className="h-4 w-4 mr-2" /> Manage Setlists
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white"
          >
            <Link to="/dashboard/sheet-music?view=list">
              <TableIcon className="h-4 w-4 mr-2" /> Table View
            </Link>
          </Button>
          
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-shrink-0 md:hidden"
          >
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>
      
      {/* Music Library */}
      <Tabs defaultValue={defaultView} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Sheet Music</h2>
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" /> Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <TableIcon className="h-4 w-4" /> List View
            </TabsTrigger>
          </TabsList>
        </div>
        
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No sheet music found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Upload your first piece of sheet music"}
            </p>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> Upload Sheet Music
            </Button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <TabsContent value="grid">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <Card 
                    key={file.id} 
                    className={`overflow-hidden relative hover:shadow-md transition-shadow ${isFileSelected(file.id) ? 'ring-2 ring-glee-purple' : ''}`}
                  >
                    {isSelectionMode ? (
                      <div 
                        className="cursor-pointer h-full"
                        onClick={() => toggleFileSelection(file)}
                      >
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox 
                            checked={isFileSelected(file.id)} 
                            onChange={() => toggleFileSelection(file)}
                          />
                        </div>
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm truncate">{file.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{file.composer}</p>
                        </CardContent>
                      </div>
                    ) : (
                      <Link to={`/dashboard/sheet-music/${file.id}`}>
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm truncate">{file.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{file.composer}</p>
                        </CardContent>
                      </Link>
                    )}
                  </Card>
                ))}

                {/* Add new sheet music card */}
                <button
                  onClick={() => setIsUploadModalOpen(true)} 
                  className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors aspect-[3/4]"
                >
                  <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Add Music</p>
                </button>
              </div>
            </TabsContent>
            
            {/* List View */}
            <TabsContent value="list">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {isSelectionMode && (
                        <th className="p-3 w-10"></th>
                      )}
                      <th className="p-3 text-left text-sm font-medium">Title</th>
                      <th className="p-3 text-left text-sm font-medium">Composer</th>
                      <th className="p-3 text-left text-sm font-medium">Date Added</th>
                      <th className="p-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr 
                        key={file.id} 
                        className={`border-b hover:bg-muted/50 ${isFileSelected(file.id) ? 'bg-muted/30' : ''}`}
                      >
                        {isSelectionMode && (
                          <td className="p-3">
                            <Checkbox 
                              checked={isFileSelected(file.id)} 
                              onCheckedChange={() => toggleFileSelection(file)}
                            />
                          </td>
                        )}
                        <td className="p-3 text-sm">{file.title}</td>
                        <td className="p-3 text-sm">{file.composer}</td>
                        <td className="p-3 text-sm">{file.created_at}</td>
                        <td className="p-3 text-right">
                          {isSelectionMode ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleFileSelection(file)}
                            >
                              {isFileSelected(file.id) ? "Deselect" : "Select"}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <Link to={`/dashboard/sheet-music/${file.id}`}>View</Link>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Multiple Download Bar */}
      <MultipleDownloadBar 
        selectedFiles={selectedFiles}
        onClearSelection={clearSelection}
      />

      {/* Modals and Drawers */}
      <UploadSheetMusicModal 
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={fetchSheetMusic}
      />
      
      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
      />
    </div>
  );
}
