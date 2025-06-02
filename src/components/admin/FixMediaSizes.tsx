
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function FixMediaSizes() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    updatedCount: number;
    errorCount: number;
  } | null>(null);

  const handleFixSizes = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/functions/v1/fix-media-sizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          updatedCount: data.updatedCount,
          errorCount: data.errorCount
        });
        toast.success(`Updated ${data.updatedCount} files`);
      } else {
        throw new Error(data.error || 'Failed to fix media sizes');
      }
    } catch (error: any) {
      console.error('Error fixing media sizes:', error);
      toast.error('Failed to fix media sizes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Fix Media File Sizes
        </CardTitle>
        <CardDescription>
          Update missing file sizes for existing media library files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleFixSizes} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing sizes...
            </>
          ) : (
            'Fix Media Sizes'
          )}
        </Button>
        
        {result && (
          <Alert>
            <AlertDescription>
              Successfully updated {result.updatedCount} files
              {result.errorCount > 0 && `, ${result.errorCount} errors`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
