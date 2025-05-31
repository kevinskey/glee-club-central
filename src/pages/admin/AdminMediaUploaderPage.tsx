
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Upload } from "lucide-react";
import AdminMediaUploader from "@/components/admin/AdminMediaUploader";

export default function AdminMediaUploaderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Uploader"
        description="Upload images to the media library for use across the site"
        icon={<Upload className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <AdminMediaUploader />
      </div>
    </div>
  );
}
