
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

// Completely new component with different name to avoid any cache issues
export default function PitchReference() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Music className="h-5 w-5" />
          Pitch Reference Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="space-y-4">
          <Music className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Audio Tools Unavailable</h3>
            <p className="text-muted-foreground text-sm">
              Digital pitch tools have been removed from this application.
              Please use external audio tools or piano for pitch reference.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
