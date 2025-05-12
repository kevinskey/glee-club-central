
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Archive } from "lucide-react";

const ArchivesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Archives"
        description="Access historical documents and media from the Glee Club"
        icon={<Archive className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">The archives section is currently under development.</p>
      </div>
    </div>
  );
};

export default ArchivesPage;
