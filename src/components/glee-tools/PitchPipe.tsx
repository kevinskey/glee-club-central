
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

// Cache-bust timestamp: 2025-06-06T00:00:00Z
// Placeholder component - audio functionality has been removed
export const PitchPipe: React.FC = () => {
  console.log('PitchPipe component loaded - audio functionality removed - cache busted');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Pitch Pipe
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">Audio Features Removed</h3>
        <p className="text-muted-foreground">
          Pitch pipe and audio functionality has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
};

export default PitchPipe;
