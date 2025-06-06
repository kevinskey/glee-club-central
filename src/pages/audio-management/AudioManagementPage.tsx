
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Music } from "lucide-react";

export default function AudioManagementPage() {
  return (
    <div className="container py-6">
      <PageHeader
        title="Audio Management"
        description="Audio functionality has been removed from the application"
        icon={<Music className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="text-center py-8">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Audio Features Removed</h3>
          <p className="text-muted-foreground">
            Audio management functionality has been removed from the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
