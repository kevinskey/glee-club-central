
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Database, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function CacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [cacheStats, setCacheStats] = useState<any>(null);

  const getCacheStats = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const stats = await Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return {
              name: cacheName,
              items: keys.length,
              urls: keys.map(request => request.url)
            };
          })
        );
        setCacheStats(stats);
      }
    } catch (error) {
      console.error('Error getting cache stats:', error);
    }
  };

  const clearAllCaches = async () => {
    setIsClearing(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        // Also clear browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Notify service worker to update
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_CLEARED'
          });
        }
        
        toast.success('All caches cleared successfully');
        setCacheStats(null);
        
        // Reload the page to get fresh content
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('Failed to clear caches');
    } finally {
      setIsClearing(false);
    }
  };

  const clearSpecificCache = async (cacheName: string) => {
    try {
      await caches.delete(cacheName);
      toast.success(`Cache "${cacheName}" cleared`);
      getCacheStats(); // Refresh stats
    } catch (error) {
      console.error('Error clearing specific cache:', error);
      toast.error(`Failed to clear cache "${cacheName}"`);
    }
  };

  React.useEffect(() => {
    getCacheStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage application caches and storage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={clearAllCaches}
            disabled={isClearing}
            variant="destructive"
            className="flex items-center gap-2"
          >
            {isClearing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Clear All Caches
          </Button>
          
          <Button
            onClick={getCacheStats}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Stats
          </Button>
        </div>

        {cacheStats && cacheStats.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Current Caches</h4>
            {cacheStats.map((cache: any) => (
              <div key={cache.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{cache.name}</span>
                  </div>
                  <Badge variant="secondary">
                    {cache.items} items
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => clearSpecificCache(cache.name)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            ))}
          </div>
        )}

        {cacheStats && cacheStats.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No caches found
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">What gets cleared:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Service Worker caches</li>
            <li>• Browser localStorage</li>
            <li>• Browser sessionStorage</li>
            <li>• Cached images and files</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
