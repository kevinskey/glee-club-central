
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Video } from "lucide-react";
import { YouTubeVideoAdmin } from "@/components/admin/YouTubeVideoAdmin";

export default function AdminVideosPage() {
  return (
    <>
      <PageHeader
        title="Video Management"
        description="Manage YouTube videos and video content for the homepage"
        icon={<Video className="h-6 w-6" />}
      />
      
      <YouTubeVideoAdmin />
    </>
  );
}
