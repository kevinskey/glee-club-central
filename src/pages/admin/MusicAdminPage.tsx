
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Music } from "lucide-react";
import { MusicPlayerAdmin } from "@/components/admin/MusicPlayerAdmin";

export default function MusicAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Music Administration"
        description="Manage music playlists, player settings, and analytics"
        icon={<Music className="h-6 w-6" />}
      />
      
      <MusicPlayerAdmin />
    </div>
  );
}
