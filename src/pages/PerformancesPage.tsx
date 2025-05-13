
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformancesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Performances</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming performances scheduled.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Past Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No past performances recorded.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No performance opportunities available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
