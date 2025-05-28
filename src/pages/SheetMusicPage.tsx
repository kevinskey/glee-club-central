
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileMusic, Search, Filter } from "lucide-react";
import { MusicAppHeader } from "@/components/layout/MusicAppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { getMediaType } from "@/utils/mediaUtils";
import { Spinner } from "@/components/ui/spinner";
import EnhancedPDFViewer from "@/components/pdf/EnhancedPDFViewer";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
  mediaSourceId: string;
  category: string;
}

export default function SheetMusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Media library integration
  const {
    isLoading: mediaLoading,
    allMediaFiles,
    fetchAllMedia,
  } = useMediaLibrary();

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
      
    } catch (error: any) {
      console.error("Error processing sheet music:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllMedia();
  }, []);
  
  // Update music files when media library is loaded
  useEffect(() => {
    if (!mediaLoading && allMediaFiles.length >= 0) {
      fetchSheetMusic();
    }
  }, [mediaLoading, allMediaFiles]);

  // Apply search filter
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = musicFiles.filter(
        file => 
          file.title.toLowerCase().includes(query) || 
          file.composer.toLowerCase().includes(query)
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(musicFiles);
    }
  }, [searchQuery, musicFiles]);

  const handleViewPDF = (item: any) => {
    setSelectedPDF(item);
  };

  const handleBackToList = () => {
    setSelectedPDF(null);
  };

  // If a PDF is selected, show the enhanced viewer
  if (selectedPDF) {
    return (
      <div className="h-screen flex flex-col">
        <MusicAppHeader currentSection="sheet-music" />
        <div className="flex-1">
          <EnhancedPDFViewer 
            url={selectedPDF.file_url} 
            title={`${selectedPDF.title} - ${selectedPDF.composer}`}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }

  if (loading || mediaLoading) {
    return (
      <>
        <MusicAppHeader currentSection="sheet-music" />
        <div className="container py-6">
          <PageHeader
            title="Sheet Music Library"
            description="Access and view your sheet music collection with enhanced PDF viewing"
            icon={<FileMusic className="h-6 w-6" />}
          />
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <MusicAppHeader currentSection="sheet-music" />
      <div className="container py-6">
        <PageHeader
          title="Sheet Music Library"
          description="Access and view your sheet music collection with enhanced PDF viewing"
          icon={<FileMusic className="h-6 w-6" />}
        />
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sheet music..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileMusic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No sheet music found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No files match your search criteria." : "No PDF files available in the media library."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden transition-all hover:shadow-md cursor-pointer group"
                onClick={() => handleViewPDF(item)}
              >
                <div className="relative">
                  <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-white border border-gray-200">
                      <PDFThumbnail 
                        url={item.file_url} 
                        title={item.title}
                        className="w-full h-full"
                        aspectRatio={3/4}
                      />
                    </div>
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm">
                      View PDF
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-1 truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 truncate" title={item.composer}>
                    {item.composer}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      PDF
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.created_at}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
