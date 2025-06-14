import React, { useState } from "react";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Download, Trash2, FileText, Image, Music, Video, File, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { InlineMediaTitleEdit } from "@/components/media/InlineMediaTitleEdit";

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdateTitle?: (id: string, newTitle: string) => Promise<void>;
}

export function MediaGridView({ mediaFiles, canEdit, canDelete, onDelete, onUpdateTitle }: MediaGridViewProps) {
  const [playingAudio, setPlayingAudio] = useState<{ [key: string]: HTMLAudioElement }>({});
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});

  const getMediaIcon = (type: MediaType, className: string = "h-8 w-8") => {
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

  const handleAudioToggle = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const audio = playingAudio[file.id];
    const isPlaying = playingStates[file.id];
    
    if (!audio) {
      const newAudio = new Audio(file.file_url);
      newAudio.addEventListener('ended', () => {
        setPlayingStates(prev => ({ ...prev, [file.id]: false }));
      });
      newAudio.addEventListener('loadstart', () => {
        console.log(`Loading audio: ${file.title} from ${file.file_url}`);
      });
      newAudio.addEventListener('error', (e) => {
        console.error(`Audio load error for ${file.title}:`, e);
      });
      
      setPlayingAudio(prev => ({ ...prev, [file.id]: newAudio }));
      newAudio.play();
      setPlayingStates(prev => ({ ...prev, [file.id]: true }));
    } else {
      if (isPlaying) {
        audio.pause();
        setPlayingStates(prev => ({ ...prev, [file.id]: false }));
      } else {
        audio.play();
        setPlayingStates(prev => ({ ...prev, [file.id]: true }));
      }
    }
  };
  
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm("Are you sure you want to delete this file?")) {
      await onDelete(id);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mediaFiles.map((file) => {
        const mediaType = getMediaType(file.file_type);
        const isImage = mediaType === "image";
        const isPdf = mediaType === "pdf";
        const isAudio = mediaType === "audio";
        const isPlaying = playingStates[file.id];
        
        return (
          <Card key={file.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-video bg-muted/40 overflow-hidden">
              {isImage ? (
                <img 
                  src={file.file_url} 
                  alt={file.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              ) : isPdf ? (
                <div className="w-full h-full">
                  <PDFThumbnail 
                    url={file.file_url} 
                    title={file.title}
                    className="w-full h-full"
                    aspectRatio={16/9}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getMediaIcon(mediaType)}
                </div>
              )}
              
              {/* Audio play button overlay */}
              {isAudio && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={(e) => handleAudioToggle(file, e)}
                    className="h-16 w-16 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-gray-800" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-800 ml-1" />
                    )}
                  </Button>
                </div>
              )}
              
              {/* Regular overlay with actions for non-audio files or hover state */}
              <div className={`absolute inset-0 bg-black/60 ${isAudio ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex items-center justify-center gap-2`}>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = file.file_url;
                    a.download = file.title;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {canDelete && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={(e) => handleDelete(file.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              {canEdit && onUpdateTitle ? (
                <InlineMediaTitleEdit
                  title={file.title}
                  onSave={(newTitle) => onUpdateTitle(file.id, newTitle)}
                  className="mb-1"
                />
              ) : (
                <h3 className="font-medium text-sm truncate mb-1">{file.title}</h3>
              )}
              
              <p className="text-xs text-muted-foreground truncate mb-2">
                {file.description || file.file_path.split('/').pop()}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize">{mediaType}</span>
                <span>{formatFileSize(file.size || 0)}</span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(file.created_at), 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
