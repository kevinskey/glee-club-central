
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  voice_part: string;
  file_url: string;
  created_at: string;
}

interface MusicFolder {
  name: string;
  files: SheetMusic[];
}

export default function SheetMusicPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<string>(
    profile?.voice_part ? profile.voice_part : "Soprano1"
  );
  const [loading, setLoading] = useState(true);
  const [musicData, setMusicData] = useState<Record<string, MusicFolder>>({});

  // Fetch sheet music data
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Organize data by voice part
      const organizedData: Record<string, MusicFolder> = {
        "Soprano1": { name: "Soprano 1", files: [] },
        "Soprano2": { name: "Soprano 2", files: [] },
        "Alto1": { name: "Alto 1", files: [] },
        "Alto2": { name: "Alto 2", files: [] },
        "Tenor": { name: "Tenor", files: [] },
        "Bass": { name: "Bass", files: [] }
      };

      if (data) {
        data.forEach((item: SheetMusic) => {
          if (organizedData[item.voice_part]) {
            organizedData[item.voice_part].files.push({
              ...item,
              // Format date for display
              created_at: new Date(item.created_at).toLocaleDateString()
            });
          }
        });
      }

      setMusicData(organizedData);
    } catch (error: any) {
      console.error("Error fetching sheet music:", error);
      toast({
        title: "Error loading sheet music",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSheetMusic();
  }, []);

  // Handle downloading PDF
  const handleDownload = (file: SheetMusic) => {
    window.open(file.file_url, "_blank");
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

        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          Object.entries(musicData).map(([key, folder]) => (
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
                      <UploadSheetMusicModal onUploadComplete={fetchSheetMusic} />
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
                              {file.composer} • Added {file.created_at}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleDownload(file)}
                            >
                              Download PDF
                            </Button>
                            <Button 
                              variant="default" 
                              asChild
                            >
                              <Link to={`/dashboard/sheet-music/${file.id}`}>
                                View PDF
                              </Link>
                            </Button>
                          </div>
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
                            <UploadSheetMusicModal onUploadComplete={fetchSheetMusic} />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}
