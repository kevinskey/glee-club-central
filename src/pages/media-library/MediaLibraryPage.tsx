import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Grid,
  List
} from 'lucide-react';
import { MediaLibraryPageContent } from '@/components/media/MediaLibraryPageContent';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function MediaLibraryPage() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isLoading: profileLoading } = useProfile();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    console.log('MediaLibraryPage: User:', user, 'Is Admin:', isAdmin());
  }, [user, isAdmin]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const handleDeleteSelected = () => {
    console.log('Deleting selected files:', selectedFiles);
    setSelectedFiles([]);
  };

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="search"
              placeholder="Search media..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="md:col-span-2"
            />

            <Tabs defaultValue="all" className="md:col-span-2 lg:col-span-1">
              <TabsList>
                <TabsTrigger value="all" onClick={() => handleFilterChange('all')}>
                  <FileText className="mr-2 h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="images" onClick={() => handleFilterChange('images')}>
                  <Image className="mr-2 h-4 w-4" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="videos" onClick={() => handleFilterChange('videos')}>
                  <Video className="mr-2 h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="audio" onClick={() => handleFilterChange('audio')}>
                  <Music className="mr-2 h-4 w-4" />
                  Audio
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-end space-x-2 lg:col-span-1">
              <Button variant="outline" size="sm" onClick={() => handleViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              {isAdmin() && (
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <MediaLibraryPageContent
        searchTerm={searchTerm}
        filterType={filterType}
        viewMode={viewMode}
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
      />

      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}
