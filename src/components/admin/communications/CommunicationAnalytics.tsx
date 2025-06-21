import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export function CommunicationAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Communication Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Analytics and reporting will be displayed here</p>
          <p className="text-sm">
            Track message delivery rates, engagement, and more
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
