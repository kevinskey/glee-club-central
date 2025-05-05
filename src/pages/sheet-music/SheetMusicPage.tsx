
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
}

export default function SheetMusicPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch sheet music data
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display
        const formattedData = data.map((item: SheetMusic) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setMusicFiles(formattedData);
      }
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

  // Check if user is an admin
  const isAdmin = profile?.role === "admin";

  return (
    <div>
      <PageHeader
        title="Sheet Music Library"
        description="Browse and download sheet music"
        icon={<FileText className="h-6 w-6" />}
        actions={
          // Only show upload button for admin users
          isAdmin && (
            <UploadSheetMusicModal onUploadComplete={fetchSheetMusic} />
          )
        }
      />

      {isAdmin && (
        <div className="mb-6 flex justify-center">
          <Button 
            size="lg" 
            className="gap-2 px-6 py-6 text-lg"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-5 w-5" /> Upload New Sheet Music
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" /> Sheet Music Collection
          </CardTitle>
          <CardDescription>
            All available sheet music for choir members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {musicFiles.length > 0 ? (
                musicFiles.map((file) => (
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No sheet music yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {isAdmin 
                      ? "Upload your first sheet music using the button below."
                      : "There's no sheet music uploaded yet."}
                  </p>
                  {isAdmin && (
                    <Button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" /> Upload Sheet Music
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <UploadSheetMusicModal 
          onUploadComplete={fetchSheetMusic}
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
        />
      )}
    </div>
  );
}
