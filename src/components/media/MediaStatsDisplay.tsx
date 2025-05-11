
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaStats } from "@/types/media";
import { FileText, FileAudio, FileImage, FileVideo, Files } from "lucide-react";

interface MediaStatsDisplayProps {
  stats: MediaStats | null;
}

export function MediaStatsDisplay({ stats }: MediaStatsDisplayProps) {
  if (!stats) {
    return null;
  }
  
  // Format file size
  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileCount = (type: string) => {
    return stats.filesByType[type] || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Files</p>
            <p className="text-2xl font-bold">{stats.totalFiles}</p>
          </div>
          <Files className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Documents</p>
            <p className="text-2xl font-bold">{getFileCount("pdf")}</p>
          </div>
          <FileText className="h-8 w-8 text-red-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Audio</p>
            <p className="text-2xl font-bold">{getFileCount("audio")}</p>
          </div>
          <FileAudio className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Images</p>
            <p className="text-2xl font-bold">{getFileCount("image")}</p>
          </div>
          <FileImage className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Size</p>
            <p className="text-2xl font-bold">{formatTotalSize(stats.totalSize)}</p>
          </div>
          <FileVideo className="h-8 w-8 text-purple-500" />
        </CardContent>
      </Card>
    </div>
  );
}
