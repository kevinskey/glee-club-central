
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Media } from 'lucide-react';

interface MediaLibraryPageContentProps {
  isAdminView?: boolean;
}

export const MediaLibraryPageContent: React.FC<MediaLibraryPageContentProps> = ({ 
  isAdminView = false 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isAdminView ? 'Admin Media Library' : 'Media Library'}
        </h1>
        <p className="text-muted-foreground">
          {isAdminView 
            ? 'Manage and organize media files for the Glee Club'
            : 'Access photos, videos, and other media content'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Media className="h-5 w-5" />
            Media Library
          </CardTitle>
          <CardDescription>
            {isAdminView 
              ? 'Upload and manage media files'
              : 'Browse available media content'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Media className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Media Library Coming Soon</h3>
          <p className="text-muted-foreground">
            Media library functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
