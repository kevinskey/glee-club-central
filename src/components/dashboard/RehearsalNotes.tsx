
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export function RehearsalNotes() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Rehearsal Notes
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Notes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="mx-auto h-10 w-10 mb-2 opacity-30" />
          <p>No rehearsal notes yet</p>
          <p className="text-sm">Add notes from rehearsals to keep track of important information</p>
        </div>
      </CardContent>
    </Card>
  );
}
