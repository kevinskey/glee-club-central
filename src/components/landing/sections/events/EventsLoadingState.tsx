
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function EventsLoadingState() {
  return (
    <div className="grid gap-4 md:gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
