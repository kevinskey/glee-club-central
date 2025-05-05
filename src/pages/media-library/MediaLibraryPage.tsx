
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadMediaModal } from "@/components/UploadMediaModal";

interface MediaFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  created_at: string;
}

export default function MediaLibraryPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch media library data
  const fetchMediaLibrary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display
        const formattedData = data.map((item: MediaFile) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setMediaFiles(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching media library:", error);
      toast({
        title: "Error loading media library",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  // Handle opening media
  const handleOpenMedia = (file: MediaFile) => {
    window.open(file.file_url, "_blank");
  };

  // Check if user is an admin
  const isAdmin = profile?.role === "admin";

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Browse and download media files"
        icon={<FolderOpen className="h-6 w-6" />}
        actions={
          // Only show upload button for admin users in the header
          isAdmin && (
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              size="sm"
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> Upload Media
            </Button>
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
            <Upload className="h-5 w-5" /> Upload New Media
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" /> Media Collection
          </CardTitle>
          <CardDescription>
            Shared media files for all choir members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col rounded-lg border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{file.title}</h3>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {file.created_at}
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="default" 
                          onClick={() => handleOpenMedia(file)}
                          className="w-full"
                        >
                          Open File
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No media files yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {isAdmin 
                      ? "Upload your first media file using the button below."
                      : "There's no media files uploaded yet."}
                  </p>
                  {isAdmin && (
                    <Button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" /> Upload Media
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {isAdmin && (
        <UploadMediaModal 
          onUploadComplete={fetchMediaLibrary}
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
        />
      )}
    </div>
  );
}
