
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ArnoldMp3Manager } from '@/components/admin/ArnoldMp3Manager';
import { Music } from 'lucide-react';

export default function ArnoldMp3Page() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Arnold's MP3 Collection"
        description="Exclusive admin access to Arnold's audio files and recordings"
        icon={<Music className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <ArnoldMp3Manager />
      </div>
    </div>
  );
}
