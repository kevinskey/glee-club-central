
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Upload, 
  Clock 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberNotes } from "@/utils/supabaseQueries";

interface AdminNotesTabProps {
  memberId: string;
}

export const AdminNotesTab: React.FC<AdminNotesTabProps> = ({ memberId }) => {
  const [newNote, setNewNote] = useState("");
  
  const { data: memberNotes, isLoading } = useQuery({
    queryKey: ['memberNotes', memberId],
    queryFn: () => fetchMemberNotes(memberId),
    enabled: !!memberId,
  });
  
  // Mock data for uploaded documents
  const uploadedDocuments = [
    { id: 1, name: "Member Contract.pdf", uploaded_at: "2025-03-15", type: "PDF" },
    { id: 2, name: "Health Form.pdf", uploaded_at: "2025-03-14", type: "PDF" },
    { id: 3, name: "Permission Slip.pdf", uploaded_at: "2025-02-28", type: "PDF" },
  ];

  const handleAddNote = () => {
    // This would typically send to API
    if (newNote.trim()) {
      // Mock adding a note for now
      alert('Note would be added: ' + newNote);
      setNewNote("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Admin Notes
          </CardTitle>
          <CardDescription>Internal notes about this member (only visible to admins)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Textarea 
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddNote} className="w-full sm:w-auto">
              Add Note
            </Button>
          </div>
          
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : memberNotes && memberNotes.length > 0 ? (
              memberNotes.map((note) => (
                <Card key={note.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Admin Note</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm">{note.note}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No notes found</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedDocuments.length > 0 ? (
            <div className="space-y-4">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              <Button className="w-full sm:w-auto mt-4">
                Upload New Document
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No documents uploaded</p>
              <Button>Upload Document</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
