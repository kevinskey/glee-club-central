
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileText } from "lucide-react";

export default function SheetMusicPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sheet Music"
        description="Access and download sheet music for your voice part"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sheet music content will be displayed here */}
        <div className="flex h-40 items-center justify-center rounded-md border bg-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">Sheet music will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
