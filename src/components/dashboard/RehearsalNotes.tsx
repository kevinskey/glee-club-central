
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function RehearsalNotes() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-glee-spelman" />
          <span>Latest Rehearsal Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium">May 8th Rehearsal</h4>
            <div className="mt-2 text-sm space-y-2">
              <p>• Focus on breath control in measures 32-48 of "Ave Maria"</p>
              <p>• Sopranos: Work on the high G transition in the third movement</p>
              <p>• Everyone: Choreography review for the finale next rehearsal</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Posted by Dr. Williams on May 8, 2025</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
