
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mic, FileAudio, Play, Upload, Volume2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { RecordingLibrary } from "@/components/recordings/RecordingLibrary";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KaraokeStudio } from "@/components/recordings/KaraokeStudio";
import { MixedRecordingsList } from "@/components/recordings/MixedRecordingsList";

export default function RecordingsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voicePart, setVoicePart] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { loading, audioFiles, fetchAudioFiles } = useAudioFiles();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("library");

  // Fetch audio files when component loads
  useEffect(() => {
    fetchAudioFiles();
  }, [fetchAudioFiles]);

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
    
    // In a real implementation, this would upload the file to Supabase
    toast({
      title: "Recording submitted!",
      description: "Your recording has been successfully uploaded.",
    });
    
    setIsDialogOpen(false);
    setVoicePart("");
    setAssignmentTitle("");
    setFile(null);
    
    // Refresh the audio files list
    fetchAudioFiles();
  };

  return (
    <div className="container py-6">
      <PageHeader
        title="Recording Library"
        description="Browse and manage vocal recordings for the Glee Club"
        icon={<FileAudio className="h-6 w-6" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-md">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FileAudio className="h-4 w-4" />
            Recording Library
          </TabsTrigger>
          <TabsTrigger value="karaoke" className="flex items-center gap-2">
            <Music2 className="h-4 w-4" />
            Karaoke Studio
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="library" className="space-y-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Create or Upload a Recording</CardTitle>
              <CardDescription>
                Record your part or upload an existing recording
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/dashboard/recording-studio')} 
                className="flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Record Audio
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" variant="outline">
                    <Upload className="h-4 w-4" />
                    Upload Recording
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Submit a recording</DialogTitle>
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
            </div>
          </CardHeader>
        </Card>

        {/* Audio Library Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" /> 
              Recording Library
            </CardTitle>
            <CardDescription>
              Browse and play all available vocal recordings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordingLibrary />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="karaoke" className="space-y-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Karaoke Studio</CardTitle>
            <CardDescription>
              Record your vocals over a backing track and create mixed recordings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KaraokeStudio />
          </CardContent>
        </Card>

        <MixedRecordingsList />
      </TabsContent>
    </div>
  );
}
