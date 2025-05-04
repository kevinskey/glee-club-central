
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Recording {
  id: string;
  name: string;
  date: string;
  voicePart: string;
  assignmentTitle: string;
  fileType: string;
}

export default function RecordingsPage() {
  const { toast } = useToast();
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: "1",
      name: "Sarah Parker",
      date: "2023-10-15",
      voicePart: "Soprano 1",
      assignmentTitle: "Ave Maria - Solo Part",
      fileType: "audio/mp3",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voicePart, setVoicePart] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !voicePart || !assignmentTitle) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields and select a file.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would upload the file to storage
    const newRecording: Recording = {
      id: `${recordings.length + 1}`,
      name: "Your Name", // Would come from the auth context in a real app
      date: new Date().toISOString().split("T")[0],
      voicePart,
      assignmentTitle,
      fileType: file.type,
    };
    
    setRecordings([...recordings, newRecording]);
    setIsDialogOpen(false);
    setVoicePart("");
    setAssignmentTitle("");
    setFile(null);
    
    toast({
      title: "Recording submitted!",
      description: "Your recording has been successfully uploaded.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Recording Submissions"
        description="Upload your vocal recordings for review"
        icon={<Mic className="h-6 w-6" />}
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a New Recording</CardTitle>
          <CardDescription>
            Record your part and upload it for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Recording
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit a recording</DialogTitle>
                <DialogDescription>
                  Upload your vocal recording for review by Dr. Johnson
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="voicePart" className="text-right">
                      Voice Part
                    </Label>
                    <Select
                      value={voicePart}
                      onValueChange={setVoicePart}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select voice part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soprano 1">Soprano 1</SelectItem>
                        <SelectItem value="Soprano 2">Soprano 2</SelectItem>
                        <SelectItem value="Alto 1">Alto 1</SelectItem>
                        <SelectItem value="Alto 2">Alto 2</SelectItem>
                        <SelectItem value="Tenor">Tenor</SelectItem>
                        <SelectItem value="Bass">Bass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignmentTitle" className="text-right">
                      Assignment
                    </Label>
                    <Input
                      id="assignmentTitle"
                      placeholder="e.g., Ave Maria - Solo Part"
                      className="col-span-3"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recording" className="text-right">
                      File
                    </Label>
                    <Input
                      id="recording"
                      type="file"
                      accept="audio/*,video/*"
                      className="col-span-3"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Upload Recording</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Recording History</CardTitle>
          <CardDescription>
            View your previous recording submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length > 0 ? (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="text-lg font-medium">{recording.assignmentTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {recording.voicePart} • Submitted on {recording.date}
                    </p>
                  </div>
                  <Button variant="outline">Play</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Mic className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No recordings yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't submitted any recordings yet. Use the button above to upload your first recording.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
