
import React from "react";
import { Image, FileText, Music, Video, File } from "lucide-react";
import { formatFileSize } from "@/utils/file-utils";
import { MediaStats } from "@/types/media";

interface MediaStatsDisplayProps {
  stats: MediaStats;
}

export function MediaStatsDisplay({ stats }: MediaStatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
      <StatCard
        label="Total Files"
        value={stats.totalFiles.toString()}
        icon={<File className="h-5 w-5" />}
      />
      <StatCard
        label="Total Size"
        value={formatFileSize(stats.totalSize)}
        icon={<File className="h-5 w-5" />}
      />
      <StatCard
        label="Images"
        value={(stats.filesByType['image'] || 0).toString()}
        icon={<Image className="h-5 w-5" />}
      />
      <StatCard
        label="Documents"
        value={(stats.filesByType['pdf'] || 0).toString()}
        icon={<FileText className="h-5 w-5" />}
      />
      <StatCard
        label="Audio/Video"
        value={((stats.filesByType['audio'] || 0) + (stats.filesByType['video'] || 0)).toString()}
        icon={<Video className="h-5 w-5" />}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 flex flex-col items-center justify-center text-center">
      <div className="text-primary/70 mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
