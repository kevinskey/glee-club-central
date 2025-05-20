
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar } from 'lucide-react';

export function RehearsalNotes() {
  // Mock rehearsal notes data
  const notes = [
    {
      id: 1,
      date: "May 1, 2025",
      title: "Ave Maria Rehearsal",
      content: "Focus on dynamics in measures 15-30. Sopranos watch the high G in measure 22."
    },
    {
      id: 2,
      date: "April 29, 2025",
      title: "Lift Every Voice Rehearsal",
      content: "Work on diction in the second verse. Remember to crescendo into the chorus."
    }
  ];

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
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{note.title}</h4>
                <div className="flex items-center text-muted-foreground text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {note.date}
                </div>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-10 w-10 mb-2 opacity-30" />
              <p>No rehearsal notes yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
