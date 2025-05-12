
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Library } from "lucide-react";

const MediaLibrary: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Library"
        description="Manage Glee Club media assets"
        icon={<Library className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Media library management tools are coming soon.</p>
      </div>
    </div>
  );
};

export default MediaLibrary;
