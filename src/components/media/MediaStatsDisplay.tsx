
import React from "react";
import { MediaStats } from "@/types/media";
import { getMediaTypeLabel, MediaType } from "@/utils/mediaUtils";
import { Badge } from "@/components/ui/badge";

interface MediaStatsDisplayProps {
  stats: MediaStats | null;
}

export function MediaStatsDisplay({ stats }: MediaStatsDisplayProps) {
  if (!stats) return null;
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Files</h3>
        <p className="text-2xl font-bold">{stats.totalFiles}</p>
      </div>
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Size</h3>
        <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
      </div>
      <div className="bg-card rounded-lg p-4 border col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Files by Type</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.filesByType).map(([type, count]) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {getMediaTypeLabel(type as MediaType)}: {count}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
