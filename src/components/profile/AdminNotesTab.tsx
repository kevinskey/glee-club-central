
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberNotes } from "@/utils/supabaseQueries";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Send } from "lucide-react";

interface AdminNotesTabProps {
  memberId: string;
}

export function AdminNotesTab({ memberId }: AdminNotesTabProps) {
  const [newNote, setNewNote] = React.useState("");
  
  const { data: memberNotes, isLoading } = useQuery({
    queryKey: ['memberNotes', memberId],
    queryFn: () => fetchMemberNotes(memberId),
  });
  
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    // This would normally send a request to the server to add the note
    console.log("Adding note:", newNote);
    // Reset the form
    setNewNote("");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
          <CardDescription>
            Private notes visible only to administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Add a New Note</h3>
              <div className="space-y-2">
                <Textarea 
                  placeholder="Enter new admin note..."
                  className="min-h-[100px]"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Previous Notes</h3>
              {isLoading ? (
                <div className="text-center py-4">Loading notes...</div>
              ) : !memberNotes || memberNotes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No notes have been added yet</div>
              ) : (
                <div className="space-y-3">
                  {memberNotes.map((note) => (
                    <div key={note.id} className="border rounded-md p-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Added on {formatDate(note.created_at)} by Admin
                          </p>
                          <p className="mt-1">{note.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Contracts, waivers, and other member documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member Contract</p>
                  <p className="text-sm text-muted-foreground">Signed on September 1, 2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Media Release Form</p>
                  <p className="text-sm text-muted-foreground">Signed on September 1, 2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
