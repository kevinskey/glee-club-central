
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Music, FileText, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';

interface SheetMusicFile {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  tags?: string[];
  voice_part?: string;
  created_at: string;
}

export default function ReaderImportPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [sheetMusic, setSheetMusic] = useState<SheetMusicFile[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<SheetMusicFile[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<SheetMusicFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchSheetMusic();
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    filterSheetMusic();
  }, [searchTerm, sheetMusic]);

  const fetchSheetMusic = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch PDFs from media library
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_library')
        .select('*')
        .eq('file_type', 'application/pdf')
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;

      // Also fetch from sheet_music table if it exists
      const { data: sheetData, error: sheetError } = await supabase
        .from('sheet_music')
        .select('*')
        .order('created_at', { ascending: false });

      // Combine both sources
      const combinedData: SheetMusicFile[] = [
        ...(mediaData?.map(item => ({
          id: item.id,
          title: item.title || 'Untitled Sheet Music',
          file_url: item.file_url,
          description: item.description,
          tags: item.tags || [],
          voice_part: item.voice_part,
          created_at: item.created_at
        })) || []),
        ...(sheetData?.map(item => ({
          id: item.id,
          title: item.title || 'Untitled Sheet Music',
          file_url: item.file_url,
          description: item.description,
          tags: item.tags || [],
          voice_part: item.voice_part,
          created_at: item.created_at
        })) || [])
      ];

      // Remove duplicates based on file_url
      const uniqueData = combinedData.filter((item, index, self) => 
        index === self.findIndex(t => t.file_url === item.file_url)
      );

      setSheetMusic(uniqueData);
    } catch (err) {
      console.error('Error fetching sheet music:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sheet music');
    } finally {
      setLoading(false);
    }
  };

  const filterSheetMusic = () => {
    if (!searchTerm) {
      setFilteredMusic(sheetMusic);
      return;
    }

    const filtered = sheetMusic.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.voice_part?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredMusic(filtered);
  };

  const handleOpenPDF = (pdf: SheetMusicFile) => {
    setSelectedPDF(pdf);
  };

  const handleBackToLibrary = () => {
    setSelectedPDF(null);
  };

  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to access the Sheet Music Reader.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // PDF Viewer Mode
  if (selectedPDF) {
    return (
      <div className="h-screen">
        <AdvancedPDFViewer 
          url={selectedPDF.file_url} 
          title={selectedPDF.title}
          sheetMusicId={selectedPDF.id}
          onBack={handleBackToLibrary}
        />
      </div>
    );
  }

  // Library Browser Mode
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-[#003366] dark:text-white">
                  Sheet Music Reader
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {filteredMusic.length} scores available
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sheet music..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading sheet music...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredMusic.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No sheet music found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Upload some PDFs to get started.'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredMusic.map((item) => (
              <Card 
                key={item.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleOpenPDF(item)}
              >
                <CardContent className={viewMode === 'grid' ? "p-4" : "p-4 flex items-center gap-4"}>
                  {viewMode === 'grid' ? (
                    <div className="space-y-3">
                      <div className="aspect-[3/4] bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-12 w-12 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                        {item.voice_part && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.voice_part}
                          </Badge>
                        )}
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {item.voice_part && (
                            <Badge variant="outline" className="text-xs">
                              {item.voice_part}
                            </Badge>
                          )}
                          {item.tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
