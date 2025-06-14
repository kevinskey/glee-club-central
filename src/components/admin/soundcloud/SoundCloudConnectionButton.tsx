
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface SoundCloudConnectionButtonProps {
  isConnecting: boolean;
  onConnect: () => void;
}

export function SoundCloudConnectionButton({ isConnecting, onConnect }: SoundCloudConnectionButtonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Connect Your SoundCloud Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect your SoundCloud account to access your tracks, playlists, and manage your music content.
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium">What you'll get:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Access to all your SoundCloud tracks and playlists</li>
            <li>• Embedded SoundCloud players for seamless playback</li>
            <li>• Real-time sync with your SoundCloud account</li>
            <li>• Admin controls for managing your music content</li>
          </ul>
        </div>
        
        <Button 
          onClick={onConnect} 
          disabled={isConnecting}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect to SoundCloud
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          By connecting, you'll be redirected to SoundCloud to authorize this application.
        </p>
      </CardContent>
    </Card>
  );
}
