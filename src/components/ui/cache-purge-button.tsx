
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CachePurgeButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export function CachePurgeButton({ 
  variant = 'outline', 
  size = 'default',
  showText = true 
}: CachePurgeButtonProps) {
  const [isPurging, setIsPurging] = useState(false);

  const purgeCache = async () => {
    if (!confirm('Are you sure you want to clear all caches? This will reload the page.')) {
      return;
    }

    setIsPurging(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        // Clear browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Notify service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_CLEARED'
          });
        }
        
        toast.success('Cache cleared! Reloading...');
        
        // Reload after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error purging cache:', error);
      toast.error('Failed to clear cache');
      setIsPurging(false);
    }
  };

  return (
    <Button
      onClick={purgeCache}
      disabled={isPurging}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {isPurging ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {showText && (isPurging ? 'Clearing...' : 'Clear Cache')}
    </Button>
  );
}
