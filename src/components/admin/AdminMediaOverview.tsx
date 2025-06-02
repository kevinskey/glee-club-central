
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { 
  FileImage, 
  Upload, 
  Image, 
  FileText, 
  Music, 
  Video,
  ArrowRight 
} from 'lucide-react';
import { formatFileSize } from '@/utils/file-utils';
import { getMediaType } from '@/utils/mediaUtils';

export function AdminMediaOverview() {
  const navigate = useNavigate();
  const { allMediaFiles, isLoading, mediaStats } = useMediaLibrary();

  const recentFiles = allMediaFiles.slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Media Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading media library...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Media Library
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/media')}
        >
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mediaStats.totalFiles}</div>
            <div className="text-xs text-muted-foreground">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(mediaStats.totalSize)}
            </div>
            <div className="text-xs text-muted-foreground">Total Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mediaStats.filesByType?.image || 0}
            </div>
            <div className="text-xs text-muted-foreground">Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(mediaStats.filesByType?.application || 0) + (mediaStats.filesByType?.audio || 0)}
            </div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <h4 className="font-medium mb-3">Recent Uploads</h4>
          {recentFiles.length > 0 ? (
            <div className="space-y-2">
              {recentFiles.map((file) => {
                const mediaType = getMediaType(file.file_type);
                return (
                  <div key={file.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex-shrink-0">
                      {getTypeIcon(mediaType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{file.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size || 0)} • {new Date(file.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No media files uploaded yet
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={() => navigate('/admin/media')}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/media')}
            className="flex-1"
          >
            Manage Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
