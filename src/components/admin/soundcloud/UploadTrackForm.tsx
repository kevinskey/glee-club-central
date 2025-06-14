
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

export function UploadTrackForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Track</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Track Title</label>
            <Input placeholder="Enter track title" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input placeholder="Enter artist name" defaultValue="Spelman Glee Club" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Input placeholder="Enter genre" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Input placeholder="e.g., 3:45" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea placeholder="Enter track description" rows={3} />
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your audio file here, or click to browse
            </p>
            <Button variant="outline">
              Choose Audio File
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload cover art (optional)
            </p>
            <Button variant="outline">
              Choose Image
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Upload & Publish</Button>
        </div>
      </CardContent>
    </Card>
  );
}
