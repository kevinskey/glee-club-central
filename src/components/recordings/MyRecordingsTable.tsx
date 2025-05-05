
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, Share2, Loader2, FileAudio } from "lucide-react";
import { AudioFile } from "@/types/audio";

interface MyRecordingsTableProps {
  recordings: AudioFile[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onShare: (recording: AudioFile) => void;
}

export function MyRecordingsTable({ 
  recordings, 
  isLoading, 
  onDelete,
  onShare 
}: MyRecordingsTableProps) {
  // Helper function to handle download
  const handleDownload = (recording: AudioFile) => {
    // Create an anchor element
    const a = document.createElement("a");
    a.href = recording.file_url;
    // Set download attribute to force download instead of navigation
    a.download = `${recording.title}.wav`;
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <FileAudio className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">No recordings yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload your first recording to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[35%]">Description</TableHead>
            <TableHead className="w-[15%]">Date Uploaded</TableHead>
            <TableHead className="w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordings.map((recording) => (
            <TableRow key={recording.id}>
              <TableCell className="font-medium">{recording.title}</TableCell>
              <TableCell>{recording.description || "-"}</TableCell>
              <TableCell>{recording.created_at}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(recording)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(recording)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(recording.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
