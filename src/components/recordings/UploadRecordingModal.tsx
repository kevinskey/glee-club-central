
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export function UploadRecordingModal() {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Upload Recording Removed</h3>
        <p className="text-muted-foreground">
          Recording upload functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
