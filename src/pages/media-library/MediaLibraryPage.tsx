
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Search, 
  Upload, 
  Filter,
  Grid,
  List
} from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';

export default function MediaLibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isAdmin, loading: profileLoading } = useProfile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const isUserAdmin = isAdmin;

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    if (user) {
      loadMedia();
    }
  }, [user]);

  if (authLoading || profileLoading || loading) {
    return <PageLoader message="Loading media library..." />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to access the media library.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Browse and manage choir photos, videos, and recordings
          </p>
        </div>
        {isUserAdmin && (
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        )}
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Media Found</h3>
              <p className="text-muted-foreground mb-4">
                The media library is empty. Upload some files to get started.
              </p>
              {isUserAdmin && (
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload First File
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardContent className="text-center py-12">
              <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No photos available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardContent className="text-center py-12">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No videos available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardContent className="text-center py-12">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audio files available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
