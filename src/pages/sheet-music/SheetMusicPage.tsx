import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Plus, Upload, FolderOpen, ListMusic, X, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdvancedSearch, SearchResultItem, SearchFilter } from "@/components/ui/advanced-search";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
}

interface SheetMusicSearchItem extends SearchResultItem {
  composer: string;
  file_url: string;
}

interface Setlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  sheet_music_ids: string[];
}

type SortOption = "newest" | "oldest" | "title" | "composer";

export default function SheetMusicPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SheetMusic[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  
  // State for setlist filtering
  const [availableSetlists, setAvailableSetlists] = useState<Setlist[]>([]);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);
  const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null);
  
  // State for composers list (for search filters)
  const [composers, setComposers] = useState<string[]>([]);

  // Advanced search filters
  const searchFilters: SearchFilter[] = [
    {
      id: "composer",
      label: "Composer",
      type: "checkbox",
      options: composers.map(composer => ({
        value: composer,
        label: composer
      }))
    }
  ];

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
        
        // Extract unique composers for filters
        const uniqueComposers = Array.from(
          new Set(formattedData.map(file => file.composer))
        );
        setComposers(uniqueComposers);
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

  // Fetch available setlists
  const fetchSetlists = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('setlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAvailableSetlists(data as Setlist[]);
      }
    } catch (error: any) {
      console.error("Error fetching setlists:", error);
      toast({
        title: "Error loading setlists",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSheetMusic();
    fetchSetlists();
  }, []);

  // Update selected setlist when ID changes
  useEffect(() => {
    if (selectedSetlistId) {
      const setlist = availableSetlists.find(s => s.id === selectedSetlistId) || null;
      setSelectedSetlist(setlist);
    } else {
      setSelectedSetlist(null);
    }
  }, [selectedSetlistId, availableSetlists]);

  // Apply filters and sort
  useEffect(() => {
    let result = [...musicFiles];
    
    // Apply setlist filter if selected
    if (selectedSetlist && selectedSetlist.sheet_music_ids?.length > 0) {
      result = result.filter(file => 
        selectedSetlist.sheet_music_ids.includes(file.id)
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "newest":
        result = result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result = result.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "title":
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "composer":
        result = result.sort((a, b) => a.composer.localeCompare(b.composer));
        break;
    }
    
    setFilteredFiles(result);
  }, [musicFiles, sortOrder, selectedSetlist]);

  // Handle search results
  const handleSearchResults = (results: SheetMusicSearchItem[]) => {
    // We only update filteredFiles if there's actually a search query
    if (searchQuery) {
      const matchingFiles = results.map(result => {
        return musicFiles.find(file => file.id === result.id)!;
      }).filter(Boolean);
      
      setFilteredFiles(matchingFiles);
    }
  };

  // Convert music files to search items
  const musicFilesToSearchItems = (): SheetMusicSearchItem[] => {
    return filteredFiles.map(file => ({
      id: file.id,
      title: file.title,
      description: `Composer: ${file.composer}`,
      category: 'Sheet Music',
      composer: file.composer,
      file_url: file.file_url,
      date: file.created_at,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    }));
  };

  // Handle search item selection
  const handleSearchItemSelect = (item: SheetMusicSearchItem) => {
    navigate(`/dashboard/sheet-music/${item.id}`);
  };

  // Clear setlist filter
  const clearSetlistFilter = () => {
    setSelectedSetlistId(null);
  };

  // View sheet music
  const viewSheetMusic = (id: string) => {
    navigate(`/dashboard/sheet-music/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sheet Music Library"
        description="Browse, view, and annotate your sheet music"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <>
            <Button 
              variant="outline"
              asChild
              className="mr-2 bg-glee-purple/10 hover:bg-glee-purple hover:text-white border-glee-purple/30"
            >
              <Link to="/dashboard/setlists" className="flex items-center gap-2">
                <ListMusic className="h-4 w-4" /> View Setlists
              </Link>
            </Button>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> Upload PDF
            </Button>
          </>
        }
      />

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="relative flex-1">
          <AdvancedSearch
            placeholder="Search sheet music..."
            items={musicFilesToSearchItems()}
            filters={searchFilters}
            onSearch={handleSearchResults}
            onItemSelect={handleSearchItemSelect}
            searchKeys={['title', 'description', 'composer']}
            maxResults={20}
          />
        </div>
        
        {/* Setlist filter dropdown */}
        <div className="w-full md:w-64">
          <Select
            value={selectedSetlistId || ""}
            onValueChange={(value) => setSelectedSetlistId(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by setlist" />
            </SelectTrigger>
            <SelectContent>
              {availableSetlists.length === 0 ? (
                <div className="py-2 px-2 text-sm text-center text-muted-foreground">
                  No setlists available
                </div>
              ) : (
                availableSetlists.map((setlist) => (
                  <SelectItem key={setlist.id} value={setlist.id}>
                    {setlist.name} 
                    <span className="text-xs text-muted-foreground ml-2">
                      ({setlist.sheet_music_ids?.length || 0})
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="composer">Composer (A-Z)</SelectItem>
            </SelectContent>
          </Select>
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
            <Link to="/dashboard/sheet-music?view=list" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" /> Table View
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Active filters display */}
      {selectedSetlist && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filter:</span>
          <Badge 
            variant="outline"
            className="flex items-center gap-1 pl-2 h-7"
          >
            <span>{selectedSetlist.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 ml-1" 
              onClick={clearSetlistFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
      
      {/* Music Library */}
      <Tabs defaultValue="grid" className="w-full">
        
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
              {searchQuery || selectedSetlist ? 
                "Try a different search term or filter" : 
                "Upload your first piece of sheet music"}
            </p>
            {(searchQuery || selectedSetlist) && (
              <div className="flex gap-2 mb-4">
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
                {selectedSetlist && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearSetlistFilter}
                  >
                    Clear setlist filter
                  </Button>
                )}
              </div>
            )}
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
                  <PDFPreview 
                    key={file.id}
                    url={file.file_url} 
                    title={file.title}
                    previewWidth={400}
                    previewHeight={500}
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => viewSheetMusic(file.id)}
                    >
                      <PDFThumbnail url={file.file_url} title={file.title} />
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm truncate">{file.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{file.composer}</p>
                      </CardContent>
                    </Card>
                  </PDFPreview>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Composer</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow 
                        key={file.id} 
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="p-0 w-12 h-12">
                          <PDFPreview 
                            url={file.file_url} 
                            title={file.title}
                            previewWidth={400}
                            previewHeight={500}
                          >
                            <PDFThumbnail 
                              url={file.file_url} 
                              title={file.title} 
                              className="w-12 h-12 rounded-sm" 
                            />
                          </PDFPreview>
                        </TableCell>
                        <TableCell className="font-medium">{file.title}</TableCell>
                        <TableCell>{file.composer}</TableCell>
                        <TableCell>{file.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              viewSheetMusic(file.id);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Modals and Drawers */}
      <UploadSheetMusicModal 
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={fetchSheetMusic}
      />
      
      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
        onSetlistsChange={fetchSetlists}
      />
    </div>
  );
}
