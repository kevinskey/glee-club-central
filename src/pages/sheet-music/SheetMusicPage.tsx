
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Plus, Upload, FolderOpen, ListMusic, X, TableIcon, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { TodaysConcertButton } from "@/components/pdf/TodaysConcertButton";
import { useAuth } from "@/contexts/AuthContext";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import { Spinner } from "@/components/ui/spinner";
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
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { getMediaType } from "@/utils/mediaUtils";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
  mediaSourceId: string;
  category: string;
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
type ViewMode = "grid" | "list";

export default function SheetMusicPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mediaId = searchParams.get('media_id');
  
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SheetMusic[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [highlightedMediaId, setHighlightedMediaId] = useState<string | null>(null);
  
  // State for setlist filtering
  const [availableSetlists, setAvailableSetlists] = useState<Setlist[]>([]);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);
  const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null);
  
  // State for composers list (for search filters)
  const [composers, setComposers] = useState<string[]>([]);

  // Media library integration
  const {
    isLoading: mediaLoading,
    error: mediaError,
    filteredMediaFiles,
    allMediaFiles,
    searchQuery: mediaSearchQuery,
    setSearchQuery: setMediaSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    fetchAllMedia,
  } = useMediaLibrary();

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

  // Fetch sheet music data from media library
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      console.log("Fetching sheet music from media library...");
      console.log("All media files:", allMediaFiles.length);
      
      // Filter for PDF files from media library with enhanced detection
      const pdfFiles = allMediaFiles
        .filter(file => {
          const isPdf = (
            file.file_type === "application/pdf" || 
            file.file_type.includes("pdf") ||
            getMediaType(file.file_type) === "pdf" ||
            (file.file_path && file.file_path.toLowerCase().endsWith('.pdf')) ||
            (file.tags && file.tags.includes("pdf")) ||
            (file.folder && file.folder.toLowerCase() === "sheet-music") ||
            (file.category && file.category.toLowerCase() === "sheet-music")
          );
          
          console.log(`File: ${file.title}, type: ${file.file_type}, isPdf: ${isPdf}`);
          return isPdf;
        })
        .map(file => ({
          id: file.id,
          title: file.title || "Untitled PDF",
          composer: file.description || "Unknown Composer",
          file_url: file.file_url,
          created_at: new Date(file.created_at).toLocaleDateString(),
          mediaSourceId: file.id,
          category: file.category || "sheet-music"
        }));
      
      console.log(`Found ${pdfFiles.length} PDF files to display as sheet music`);
      
      setMusicFiles(pdfFiles);
      setFilteredFiles(pdfFiles);
      
      // Extract unique composers for filters
      const uniqueComposers = Array.from(
        new Set(pdfFiles.map(file => file.composer))
      ).filter(composer => typeof composer === 'string') as string[];
      
      setComposers(uniqueComposers);
      
      // Handle media_id parameter if present
      if (mediaId) {
        setHighlightedMediaId(mediaId);
        
        // Find the matching file
        const matchingFile = pdfFiles.find(file => file.mediaSourceId === mediaId);
        if (matchingFile) {
          // Scroll to the matching file after render
          setTimeout(() => {
            const element = document.getElementById(`sheet-music-${mediaId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
      }
      
    } catch (error: any) {
      console.error("Error processing sheet music:", error);
      toast({
        description: error.message || "An unexpected error occurred"
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

  // Initial data fetch
  useEffect(() => {
    // Force refresh of all media
    fetchAllMedia();
  }, []);
  
  // Update music files when media library is loaded
  useEffect(() => {
    if (!mediaLoading && allMediaFiles.length >= 0) {
      fetchSheetMusic();
    }
  }, [mediaLoading, allMediaFiles]);

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
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        file => 
          file.title.toLowerCase().includes(query) || 
          file.composer.toLowerCase().includes(query)
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
  }, [musicFiles, sortOrder, selectedSetlist, searchQuery]);

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

  // View sheet music - updated to use the correct route
  const viewSheetMusic = (id: string) => {
    navigate(`/dashboard/sheet-music/${id}`);
  };

  // Handle upload complete
  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data from media library");
    fetchAllMedia();
    toast({
      title: "Upload complete",
      description: "Your sheet music has been uploaded successfully",
    });
  };

  if (loading || mediaLoading) {
    return (
      <div className="container py-6">
        <PageHeader
          title="Sheet Music Library"
          description="Access and view your sheet music collection"
          icon={<FileText className="h-6 w-6" />}
        />
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  // Render grid view
  const renderGridView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredFiles.map((file) => (
        <Card 
          key={file.id} 
          id={`sheet-music-${file.mediaSourceId}`}
          className={`overflow-hidden transition-all hover:shadow-md cursor-pointer group ${
            highlightedMediaId === file.mediaSourceId ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => viewSheetMusic(file.id)}
        >
          <div className="relative">
            <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-white border border-gray-200">
                <PDFThumbnail 
                  url={file.file_url} 
                  title={file.title}
                  className="w-full h-full"
                  aspectRatio={3/4}
                />
              </div>
            </div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button variant="secondary" size="sm">
                Open Advanced Viewer
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-bold text-sm mb-1 truncate" title={file.title}>
              {file.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 truncate" title={file.composer}>
              {file.composer}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                PDF
              </Badge>
              <span className="text-xs text-muted-foreground">
                {file.created_at}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16"></TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSortOrder(sortOrder === "title" ? "newest" : "title")}
            >
              <div className="flex items-center gap-1">
                Title
                {sortOrder === "title" && <span className="text-xs">↑</span>}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSortOrder(sortOrder === "composer" ? "newest" : "composer")}
            >
              <div className="flex items-center gap-1">
                Composer
                {sortOrder === "composer" && <span className="text-xs">↑</span>}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            >
              <div className="flex items-center gap-1">
                Date Added
                {(sortOrder === "newest" || sortOrder === "oldest") && (
                  <span className="text-xs">{sortOrder === "newest" ? "↓" : "↑"}</span>
                )}
              </div>
            </TableHead>
            <TableHead className="w-20">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow 
              key={file.id}
              id={`sheet-music-${file.mediaSourceId}`}
              className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                highlightedMediaId === file.mediaSourceId ? 'bg-primary/10' : ''
              }`}
              onClick={() => viewSheetMusic(file.id)}
            >
              <TableCell className="p-2">
                <div className="w-12 h-16 bg-white border border-gray-200 rounded overflow-hidden">
                  <PDFThumbnail 
                    url={file.file_url} 
                    title={file.title}
                    className="w-full h-full"
                    aspectRatio={3/4}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{file.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {file.composer}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {file.created_at}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  PDF
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container py-6">
      <PageHeader
        title="Sheet Music Library"
        description="Access and view your sheet music collection with advanced PDF viewing"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <TodaysConcertButton />
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Sheet Music
            </Button>
          </div>
        }
      />

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <Select value={sortOrder} onValueChange={(value: SortOption) => setSortOrder(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="composer">Composer A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No sheet music found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No files match your search criteria." : "Upload your first PDF to get started."}
          </p>
          <div className="flex gap-2 justify-center">
            <TodaysConcertButton />
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Sheet Music
            </Button>
          </div>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}
        </>
      )}

      <UploadSheetMusicModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
