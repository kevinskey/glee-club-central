
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen, Loader2, Upload, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
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

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
}

type SortOption = "newest" | "oldest" | "title" | "composer";

export default function SheetMusicPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");

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

  // Filter and sort music files
  useEffect(() => {
    let result = [...musicFiles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        file => 
          file.title.toLowerCase().includes(query) || 
          file.composer.toLowerCase().includes(query) ||
          file.created_at.toLowerCase().includes(query)
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
  }, [searchQuery, musicFiles, sortOrder]);

  return (
    <div>
      <PageHeader
        title="Sheet Music Library"
        description="Browse, search and download sheet music"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" /> Upload PDF
          </Button>
        }
      />

      {/* Search and filter section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> Search Sheet Music
          </CardTitle>
          <CardDescription>
            Find sheet music by title, composer, or upload date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title, composer or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
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
          </div>
          <Button 
            size="lg" 
            className="gap-2 w-full py-6 md:hidden"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-5 w-5" /> Upload New Sheet Music
          </Button>
        </CardContent>
      </Card>

      {/* Sheet music table for larger screens */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" /> Sheet Music Collection
          </CardTitle>
          <CardDescription>
            All available sheet music for choir members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead className="w-[25%]">Composer</TableHead>
                  <TableHead className="w-[20%]">Upload Date</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.title}</TableCell>
                    <TableCell>{file.composer}</TableCell>
                    <TableCell>{file.created_at}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="default" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/dashboard/sheet-music/${file.id}`}>
                          View PDF
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No sheet music found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Be the first to upload sheet music for the choir."}
              </p>
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" /> Upload Sheet Music
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold truncate">{file.title}</h3>
                      <p className="text-sm text-muted-foreground">{file.composer}</p>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/dashboard/sheet-music/${file.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Added {file.created_at}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No sheet music found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No sheet music has been uploaded yet."}
            </p>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> Upload Sheet Music
            </Button>
          </div>
        )}
      </div>

      <UploadSheetMusicModal 
        onUploadComplete={fetchSheetMusic}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
}
