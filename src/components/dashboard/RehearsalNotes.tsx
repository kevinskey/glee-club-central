
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const RehearsalNotes: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-glee-spelman" />
          <span>Rehearsal Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-4 rounded-md border bg-muted/30">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Spring Concert Preparation</span>
              <span className="text-muted-foreground">April 28, 2025</span>
            </div>
            <p className="text-sm">
              Focus on dynamics in "Lift Every Voice" measures 24-36. 
              Sopranos, work on breath control in the sustained high notes.
              Everyone should memorize first verse by next rehearsal.
            </p>
          </div>
          <Link 
            to="/dashboard/sheet-music" 
            className="text-sm text-glee-spelman hover:underline inline-flex font-medium"
          >
            View all notes
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
