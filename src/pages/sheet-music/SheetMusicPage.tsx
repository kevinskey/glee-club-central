import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
      // Set media library to only show PDF files
      setSelectedMediaType("pdf");
      
      // Wait for media library to load
      if (mediaLoading) {
        return; // Will try again when mediaLoading changes
      }

      console.log("Media files loaded:", filteredMediaFiles.length);
      
      // Map PDF files from media library to sheet music format - enhanced PDF detection
      const pdfFiles = allMediaFiles
        .filter(file => {
          // Improved PDF detection logic
          return (
            file.file_type === "application/pdf" || 
            file.file_type.includes("pdf") ||
            getMediaType(file.file_type) === "pdf" ||
            (file.file_path && file.file_path.toLowerCase().endsWith('.pdf')) ||
            (file.tags && file.tags.includes("pdf")) ||
            (file.folder && file.folder.toLowerCase() === "sheet-music") ||
            (file.category && file.category.toLowerCase() === "sheet-music")
          );
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
      
      console.log(`Found ${pdfFiles.length} PDF files in the media library`);
      
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
    // Then fetch setlists separately
    // fetchSetlists();
  }, []);
  
  // Update music files when media library is loaded
  useEffect(() => {
    if (!mediaLoading) {
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

  // View sheet music
  const viewSheetMusic = (id: string) => {
    navigate(`/dashboard/sheet-music/${id}`);
  };

  // Handle upload complete
  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data from media library");
    // Refetch all media files without filtering to get the latest uploads
    fetchAllMedia();
    toast({
      title: "Upload complete",
      description: "Your sheet music has been uploaded successfully",
    });
  };

  return (
    <div>
      {/* Component UI implementation */}
      <h1>Sheet Music Page</h1>
      {/* The rest of the component's UI would go here */}
    </div>
  );
}
