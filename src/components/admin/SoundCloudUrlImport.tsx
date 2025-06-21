import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Plus,
  AlertCircle,
  CheckCircle,
  Music,
  ListMusic,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportedContent {
  id: string;
  type: "track" | "playlist";
  title: string;
  artist: string;
  url: string;
  trackCount?: number;
  duration?: string;
  status: "pending" | "imported" | "error";
}

export function SoundCloudUrlImport() {
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importedItems, setImportedItems] = useState<ImportedContent[]>([]);
  const { toast } = useToast();

  const parseSoundCloudUrl = (url: string) => {
    // Basic URL validation and parsing
    const soundcloudRegex = /^https?:\/\/(www\.)?soundcloud\.com\/.+/;
    if (!soundcloudRegex.test(url)) {
      throw new Error("Please enter a valid SoundCloud URL");
    }

    // Extract type and content info from URL
    const urlParts = url.split("/").filter((part) => part);
    const isPlaylist = url.includes("/sets/");
    const isTrack = !isPlaylist && urlParts.length >= 4;

    return {
      type: isPlaylist ? "playlist" : "track",
      originalUrl: url,
      isValid: isPlaylist || isTrack,
    };
  };

  const handleImport = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a SoundCloud URL to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const parsed = parseSoundCloudUrl(importUrl);

      if (!parsed.isValid) {
        throw new Error("Invalid SoundCloud URL format");
      }

      // Simulate import process (in real implementation, this would call SoundCloud API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newItem: ImportedContent = {
        id: Date.now().toString(),
        type: parsed.type as "track" | "playlist",
        title:
          parsed.type === "playlist" ? "Imported Playlist" : "Imported Track",
        artist: "SoundCloud Artist",
        url: importUrl,
        trackCount:
          parsed.type === "playlist"
            ? Math.floor(Math.random() * 20) + 5
            : undefined,
        duration: `${Math.floor(Math.random() * 45) + 15}m`,
        status: "imported",
      };

      setImportedItems((prev) => [newItem, ...prev]);
      setImportUrl("");

      toast({
        title: "Import Successful!",
        description: `${parsed.type === "playlist" ? "Playlist" : "Track"} imported successfully`,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to import SoundCloud content",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setImportedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Import from SoundCloud URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">SoundCloud URL</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://soundcloud.com/artist/track-or-playlist"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleImport}
                disabled={isImporting || !importUrl.trim()}
                className="gap-2"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Paste any SoundCloud track or playlist URL to import it into your
              library. Examples: tracks, playlists, albums, or sets.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {importedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Imported ({importedItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {importedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    {item.type === "playlist" ? (
                      <ListMusic className="w-5 h-5 text-white" />
                    ) : (
                      <Music className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      {item.status === "imported" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.artist}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {item.trackCount && <span>{item.trackCount} tracks</span>}
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
