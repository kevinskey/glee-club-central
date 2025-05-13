import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Search, Plus, Upload, FolderOpen, ListMusic, Check, TableIcon, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { MultipleDownloadBar } from "@/components/sheet-music/MultipleDownloadBar";
import { getMediaType } from "@/utils/mediaUtils";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
  voicing?: string;
}

interface MediaSheetMusic {
  id: string;
  title: string;
  composer?: string;
  file_url: string;
  created_at: string;
  voicing?: string;
  file_type: string;
  description?: string;
  category?: string;
  tags?: string[];
}

type SortColumn = 'title' | 'composer' | 'voicing' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function SheetMusicPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<MediaSheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaSheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MediaSheetMusic[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultView = searchParams.get("view") === "list" ? "list" : "grid";
  
  // Media library integration
  const {
    isLoading: mediaLoading,
    error: mediaError,
    filteredMediaFiles,
    searchQuery: mediaSearchQuery,
    setSearchQuery: setMediaSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    setDateFilter,
    fetchAllMedia,
  } = useMediaLibrary();
  
  // Sorting states
  const [sortColumn, setSortColumn] = useState<SortColumn>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fetch sheet music data
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      // Set media library to only show PDF files
      setSelectedMediaType("pdf");
      
      // Map media library files to sheet music format
      const pdfFiles = filteredMediaFiles
        .filter(file => file.file_type === "application/pdf" || getMediaType(file.file_type) === "pdf")
        .map(file => ({
          id: file.id,
          title: file.title,
          composer: file.description || "Unknown",
          file_url: file.file_url,
          created_at: new Date(file.created_at).toLocaleDateString(),
          voicing: file.category || "N/A",
          file_type: file.file_type,
          description: file.description,
          category: file.category,
          tags: file.tags,
        }));
        
      setMusicFiles(pdfFiles);
      setFilteredFiles(pdfFiles);
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
    fetchAllMedia();
  }, []);
  
  // Update music files when media library is loaded
  useEffect(() => {
    if (!mediaLoading && filteredMediaFiles.length > 0) {
      fetchSheetMusic();
    }
  }, [mediaLoading, filteredMediaFiles]);

  // Filter music files based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredFiles(
        musicFiles.filter(
          file => 
            file.title.toLowerCase().includes(query) || 
            (file.composer && file.composer.toLowerCase().includes(query)) ||
            (file.voicing && file.voicing.toLowerCase().includes(query)) ||
            (file.tags && file.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      );
    } else {
      setFilteredFiles(musicFiles);
    }
  }, [searchQuery, musicFiles]);

  // Sort the filtered files
  useEffect(() => {
    const sortedFiles = [...filteredFiles].sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];
      
      // Handle undefined values
      if (!valueA) valueA = '';
      if (!valueB) valueB = '';
      
      if (sortDirection === 'asc') {
        return valueA.toString().localeCompare(valueB.toString());
      } else {
        return valueB.toString().localeCompare(valueA.toString());
      }
    });
    
    setFilteredFiles(sortedFiles);
  }, [sortColumn, sortDirection]);

  // Toggle sort direction or change sort column
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Toggle file selection
  const toggleFileSelection = (file: MediaSheetMusic) => {
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
  
  // Open sheet music viewer with enhanced features
  const openSheetMusic = (file: MediaSheetMusic) => {
    navigate(`/dashboard/sheet-music/${file.id}`, { 
      state: { 
        file,
        fromMediaLibrary: true 
      }
    });
  };

  const isMobile = useIsMobile();

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
                className="gap-2 mr-2 hidden sm:flex"
              >
                <Check className="h-4 w-4" /> Select Multiple
              </Button>
            )}
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> {isMobile ? "Upload" : "Upload PDF"}
            </Button>
          </>
        }
      />

      {/* Search bar */}
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
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex-shrink-0"
            onClick={() => setIsSetlistDrawerOpen(true)}
          >
            <ListMusic className="h-4 w-4 mr-2" /> {isMobile ? "Setlists" : "Manage Setlists"}
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="flex-shrink-0"
          >
            <Link to="/dashboard/sheet-music?view=list">
              <TableIcon className="h-4 w-4 mr-2" /> {isMobile ? "Table" : "Table View"}
            </Link>
          </Button>
          
          {isMobile && !isSelectionMode && (
            <Button 
              variant="outline"
              onClick={() => setIsSelectionMode(true)}
              className="flex-shrink-0"
            >
              <Check className="h-4 w-4 mr-2" /> Select
            </Button>
          )}
        </div>
      </div>
      
      {/* Music Library */}
      <Tabs defaultValue={defaultView} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Sheet Music</h2>
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" /> {isMobile ? "" : "Grid View"}
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <TableIcon className="h-4 w-4" /> {isMobile ? "" : "List View"}
            </TabsTrigger>
          </TabsList>
        </div>
        
        {loading || mediaLoading ? (
          <div className="grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 md:p-8 text-center">
            <FileText className="mb-4 h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
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
                            className="h-5 w-5 border-2" // Make checkbox larger for touch
                          />
                        </div>
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                        </div>
                        <CardContent className="p-2 sm:p-3">
                          <h3 className="font-medium text-xs sm:text-sm truncate">{file.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{file.composer}</p>
                          {file.voicing && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {file.voicing}
                              </span>
                            </p>
                          )}
                        </CardContent>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer"
                        onClick={() => openSheetMusic(file)}
                      >
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                        </div>
                        <CardContent className="p-2 sm:p-3">
                          <h3 className="font-medium text-xs sm:text-sm truncate">{file.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{file.composer}</p>
                          {file.voicing && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {file.voicing}
                              </span>
                            </p>
                          )}
                          {isMobile ? null : file.tags && file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  {tag}
                                </span>
                              ))}
                              {file.tags.length > 2 && (
                                <span className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  +{file.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </div>
                    )}
                  </Card>
                ))}

                {/* Add new sheet music card */}
                <button
                  onClick={() => setIsUploadModalOpen(true)} 
                  className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-3 sm:p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors aspect-[3/4]"
                >
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm font-medium">Add Music</p>
                </button>
              </div>
            </TabsContent>
            
            {/* List View - Optimize for mobile */}
            <TabsContent value="list">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isSelectionMode && (
                        <TableHead className="w-10"></TableHead>
                      )}
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center">
                          Title
                          <ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </div>
                      </TableHead>
                      {!isMobile && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('composer')}
                        >
                          <div className="flex items-center">
                            Composer
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                      )}
                      {!isMobile && (
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('voicing')}
                        >
                          <div className="flex items-center">
                            Category
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                      )}
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow 
                        key={file.id} 
                        className={`hover:bg-muted/50 ${isFileSelected(file.id) ? 'bg-muted/30' : ''}`}
                      >
                        {isSelectionMode && (
                          <TableCell className="pr-0">
                            <Checkbox 
                              checked={isFileSelected(file.id)} 
                              onCheckedChange={() => toggleFileSelection(file)}
                              className="h-5 w-5" // Larger for touch
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-sm">
                          <div className="line-clamp-2">
                            {file.title}
                            {isMobile && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {file.composer}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        {!isMobile && <TableCell className="text-sm">{file.composer}</TableCell>}
                        {!isMobile && (
                          <TableCell>
                            {file.voicing ? (
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {file.voicing}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          {isSelectionMode ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleFileSelection(file)}
                              className="text-xs py-1 px-2 h-auto"
                            >
                              {isFileSelected(file.id) ? "Deselect" : "Select"}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openSheetMusic(file)}
                              className="text-xs py-1 px-2 h-auto"
                            >
                              View
                            </Button>
                          )}
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
