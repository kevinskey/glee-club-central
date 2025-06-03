
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { createTestHeroSlide, checkHeroSystemStatus } from '@/utils/createTestHeroSlide';
import { toast } from 'sonner';

export function HeroTestButton() {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const systemStatus = await checkHeroSystemStatus();
      setStatus(systemStatus);
      toast.success('Hero system status checked!');
    } catch (error) {
      toast.error('Failed to check hero system status');
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateTestSlide = async () => {
    setIsCreating(true);
    try {
      await createTestHeroSlide();
      // Refresh status after creation
      await handleCheckStatus();
    } catch (error) {
      toast.error('Failed to create test slide');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Hero System Test
        </CardTitle>
        <CardDescription>
          Test the hero slide system and diagnose any issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleCheckStatus} 
            disabled={isChecking}
            variant="outline"
          >
            {isChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Check Status
          </Button>
          
          <Button 
            onClick={handleCreateTestSlide} 
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Create Test Slide
          </Button>
        </div>

        {status && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              {status.slideCount > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-600" />
              )}
              System Status
            </h4>
            <div className="space-y-1 text-sm">
              <p>Total slides: <strong>{status.slideCount}</strong></p>
              <p>Visible slides: <strong>{status.visibleSlideCount}</strong></p>
              <p>Hero media files: <strong>{status.heroMediaFiles.length}</strong></p>
              <p>Settings configured: <strong>{status.settings.length > 0 ? 'Yes' : 'No'}</strong></p>
            </div>
            
            {status.slideCount === 0 && (
              <div className="mt-3 p-2 bg-orange-100 border border-orange-200 rounded text-orange-800 text-sm">
                No slides found for homepage hero. Click "Create Test Slide" to add one.
              </div>
            )}
            
            {status.visibleSlideCount === 0 && status.slideCount > 0 && (
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-yellow-800 text-sm">
                Slides exist but none are visible. Check the Universal Hero Manager to make them visible.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
