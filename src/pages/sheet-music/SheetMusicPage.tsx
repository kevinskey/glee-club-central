
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MusicFile {
  id: string;
  title: string;
  composer: string;
  date: string;
  url: string;
}

interface MusicFolder {
  name: string;
  files: MusicFile[];
}

// Sample data
const musicData: Record<string, MusicFolder> = {
  "Soprano1": {
    name: "Soprano 1",
    files: [
      {
        id: "s1-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "s1-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  },
  "Soprano2": {
    name: "Soprano 2",
    files: [
      {
        id: "s2-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "s2-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  },
  "Alto1": {
    name: "Alto 1",
    files: [
      {
        id: "a1-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "a1-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  },
  "Alto2": {
    name: "Alto 2",
    files: [
      {
        id: "a2-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "a2-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  },
  "Tenor": {
    name: "Tenor",
    files: [
      {
        id: "t-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "t-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  },
  "Bass": {
    name: "Bass",
    files: [
      {
        id: "b-1",
        title: "Ave Maria",
        composer: "Franz Schubert",
        date: "2023-10-15",
        url: "#"
      },
      {
        id: "b-2",
        title: "Hallelujah",
        composer: "Leonard Cohen, arr. J. Smith",
        date: "2023-09-20",
        url: "#"
      }
    ]
  }
};

export default function SheetMusicPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = React.useState<string>(
    profile?.voice_part ? profile.voice_part : "Soprano1"
  );
  
  // Handle file download
  const handleDownload = (file: MusicFile) => {
    // This would be replaced with actual download functionality
    console.log(`Downloading: ${file.title}`);
    alert(`In a real app, this would download "${file.title}" sheet music`);
  };

  return (
    <div>
      <PageHeader
        title="Sheet Music Library"
        description="Browse and download sheet music for your voice part"
        icon={<FileText className="h-6 w-6" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="Soprano1">Soprano 1</TabsTrigger>
          <TabsTrigger value="Soprano2">Soprano 2</TabsTrigger>
          <TabsTrigger value="Alto1">Alto 1</TabsTrigger>
          <TabsTrigger value="Alto2">Alto 2</TabsTrigger>
          <TabsTrigger value="Tenor">Tenor</TabsTrigger>
          <TabsTrigger value="Bass">Bass</TabsTrigger>
        </TabsList>

        {Object.entries(musicData).map(([key, folder]) => (
          <TabsContent key={key} value={key}>
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" /> {folder.name} Sheet Music
                    </CardTitle>
                    <CardDescription>
                      Sheet music for {folder.name} singers
                    </CardDescription>
                  </div>
                  {profile?.role === "admin" && (
                    <Button size="sm">Upload New Sheet Music</Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {folder.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <h3 className="text-lg font-medium">{file.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {file.composer} • Added {file.date}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownload(file)}
                        >
                          Download PDF
                        </Button>
                      </div>
                    ))}

                    {folder.files.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No sheet music yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          There's no sheet music uploaded for this voice part yet.
                        </p>
                        {profile?.role === "admin" && (
                          <Button>Upload Sheet Music</Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
