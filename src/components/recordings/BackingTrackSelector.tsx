
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioFile } from "@/types/audio";
import { Button } from "@/components/ui/button";
import { Loader2, Music, RefreshCw } from "lucide-react";
import { useBackingTracks } from "@/hooks/useBackingTracks";
import { Badge } from "@/components/ui/badge";

interface BackingTrackSelectorProps {
  onTrackSelected: (track: AudioFile | null) => void;
  selectedTrackId?: string;
}

export function BackingTrackSelector({ onTrackSelected, selectedTrackId }: BackingTrackSelectorProps) {
  const { loading, backingTracks, fetchBackingTracks } = useBackingTracks();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBackingTracks();
    setRefreshing(false);
  };

  const handleSelectTrack = (id: string) => {
    if (id === "none") {
      onTrackSelected(null);
      return;
    }
    
    const selectedTrack = backingTracks.find(track => track.id === id);
    if (selectedTrack) {
      onTrackSelected(selectedTrack);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <span className="font-medium">Backing Track</span>
          {backingTracks.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {backingTracks.length} Available
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          {refreshing || loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Select 
        value={selectedTrackId || "none"}
        onValueChange={handleSelectTrack}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a backing track" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No backing track</SelectItem>
          {backingTracks.map(track => (
            <SelectItem key={track.id} value={track.id}>
              {track.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && backingTracks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-1">
          No backing tracks available. Upload audio files and mark them as backing tracks.
        </p>
      )}
    </div>
  );
}
