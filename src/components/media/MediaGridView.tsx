import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Trash2, FileText, Image, Music, Video, File, Play, Pause } from "lucide-react";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { InlineTitleEditor } from "./InlineTitleEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export function MediaGridView({ mediaFiles, canEdit, canDelete, onDelete, onRefresh }: MediaGridViewProps) {
  const [playingStates, setPlayingStates] = useState<{[key: string]: boolean}>({});
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const audioRefs = useRef<{[key: string]: HTMLAudioElement}>({});

  // Cleanup all audio when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      audioRefs.current = {};
    };
  }, []);

  const getMediaIcon = (type: MediaType, className: string = "h-12 w-12 text-muted-foreground") => {
    switch (type) {
      case "image":
        return <Image className={className} />;
      case "pdf":
        return <FileText className={className} />;
      case "audio":
        return <Music className={className} />;
      case "video":
        return <Video className={className} />;
      default:
        return <File className={className} />;
    }
  };

  const toggleAudioPlayback = (fileId: string, fileUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Stop all other playing audio first
      Object.entries(audioRefs.current).forEach(([id, audio]) => {
        if (id !== fileId && audio && !audio.paused) {
          audio.pause();
          setPlayingStates(prev => ({ ...prev, [id]: false }));
        }
      });
      
      let currentAudio = audioRefs.current[fileId];
      
      if (!currentAudio) {
        currentAudio = new Audio(fileUrl);
        audioRefs.current[fileId] = currentAudio;
        
        currentAudio.addEventListener('ended', () => {
          setPlayingStates(prev => ({ ...prev, [fileId]: false }));
        });
        
        currentAudio.addEventListener('error', (error) => {
          console.error('Audio playback error:', error);
          setPlayingStates(prev => ({ ...prev, [fileId]: false }));
        });
      }
      
      if (playingStates[fileId]) {
        currentAudio.pause();
        setPlayingStates(prev => ({ ...prev, [fileId]: false }));
      } else {
        currentAudio.play().then(() => {
          setPlayingStates(prev => ({ ...prev, [fileId]: true }));
        }).catch((error) => {
          console.error('Audio play failed:', error);
          setPlayingStates(prev => ({ ...prev, [fileId]: false }));
        });
      }
    } catch (error) {
      console.error('Audio toggle error:', error);
      setPlayingStates(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleTitleSave = async (fileId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ title: newTitle })
        .eq('id', fileId);

      if (error) throw error;

      setEditingTitleId(null);
      toast.success('Title updated successfully');
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update title:', error);
      toast.error('Failed to update title');
      throw error;
    }
  };

  const handleTitleClick = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (canEdit) {
      setEditingTitleId(fileId);
    }
  };

  const renderMediaPreview = (file: MediaFile) => {
    const mediaType = getMediaType(file.file_type);
    
    switch (mediaType) {
      case "image":
        return (
          <img 
            src={file.file_url} 
            alt={file.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-muted">
                    <svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        );
      
      case "pdf":
        return (
          <div className="w-full h-full relative">
            <PDFThumbnail 
              url={file.file_url} 
              title={file.title} 
              className="w-full h-full"
              aspectRatio={1}
            />
          </div>
        );
      
      case "audio":
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted relative">
            {getMediaIcon(mediaType)}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={(e) => toggleAudioPlayback(file.id, file.file_url, e)}
            >
              {playingStates[file.id] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {getMediaIcon(mediaType)}
          </div>
        );
    }
  };

  if (mediaFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter settings</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaFiles.map((file) => {
        const mediaType = getMediaType(file.file_type);
        
        return (
          <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {renderMediaPreview(file)}
            </div>
            
            <CardContent className="p-4">
              {editingTitleId === file.id ? (
                <InlineTitleEditor
                  title={file.title}
                  onSave={(newTitle) => handleTitleSave(file.id, newTitle)}
                  onCancel={() => setEditingTitleId(null)}
                  className="mb-1"
                />
              ) : (
                <h3 
                  className={`font-medium text-sm truncate mb-1 ${canEdit ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  onClick={(e) => handleTitleClick(file.id, e)}
                  title={canEdit ? 'Click to edit title' : file.title}
                >
                  {file.title}
                </h3>
              )}
              
              {file.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {file.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="uppercase font-medium">{mediaType}</span>
                <span>{formatFileSize(file.size || 0)}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                {file.folder && (
                  <span className="bg-muted px-2 py-1 rounded">{file.folder}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
