
import React from 'react';

interface MediaFileStatsProps {
  fileCount: number;
}

export function MediaFileStats({ fileCount }: MediaFileStatsProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        {fileCount} file{fileCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
