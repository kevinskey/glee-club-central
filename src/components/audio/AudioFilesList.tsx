
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface AudioFilesListProps {
  loading?: boolean;
  displayFiles?: any[];
  category?: string;
  searchQuery?: string;
  canDeleteFile?: (uploadedBy: string) => boolean;
  confirmDelete?: (id: string) => void;
  onUploadClick?: (category?: string) => void;
  renderAdditionalActions?: (file: any) => React.ReactNode;
}

export function AudioFilesList(props: AudioFilesListProps) {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Audio Features Removed</h3>
        <p className="text-muted-foreground">
          Audio functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
