
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

// Completely rewritten component to break cache - no audio functionality
const PitchPipeComponent: React.FC = () => {
  // Force new component identity to break any cached imports
  React.useEffect(() => {
    console.log('New PitchPipe component loaded - audio removed - v2.0');
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Music className="h-5 w-5" />
          Digital Pitch Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="space-y-4">
          <Music className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Audio Tools Disabled</h3>
            <p className="text-muted-foreground text-sm">
              Pitch pipe and audio functionality has been removed from this application.
              Please use external audio tools for pitch reference.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Export with different name to force cache invalidation
export const PitchPipe = PitchPipeComponent;
export default PitchPipeComponent;
