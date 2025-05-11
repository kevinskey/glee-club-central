
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon } from "lucide-react";
import { MediaLibraryPage } from "@/pages/media-library/MediaLibraryPage";

export default function MediaManagerPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Media Manager"
        description="Upload, organize, and manage media files for the Glee Club"
        icon={<FilesIcon className="h-6 w-6" />}
      />
      
      <div className="mt-6">
        <MediaLibraryPage />
      </div>
    </div>
  );
}
