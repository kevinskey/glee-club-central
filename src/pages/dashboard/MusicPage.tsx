
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Music } from "lucide-react";

const MusicPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Sheet Music"
        description="Access your sheet music for upcoming performances"
        icon={<Music className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">No sheet music has been assigned yet.</p>
      </div>
    </div>
  );
};

export default MusicPage;
