
import React, { useState } from "react";
import { MediaFileLight } from "@/hooks/usePaginatedMediaLibrary";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Download, Trash2, FileText, Image, Music, Video, File, Play, Pause, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { InlineMediaTitleEdit } from "@/components/media/InlineMediaTitleEdit";

interface LightweightMediaCardProps {
  file: MediaFileLight;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
  onPreview: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => Promise<void>;
}

export function LightweightMediaCard({ 
  file, 
  canEdit, 
  canDelete, 
  onDelete, 
  onPreview,
  onUpdateTitle
}: LightweightMediaCardProps) {
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const mediaType = getMediaType(file.file_type);
  const isImage = mediaType === "image";
  const isPdf = mediaType === "pdf";
  const isAudio = mediaType === "audio";

  const getMediaIcon = (type: MediaType, className: string = "h-6 w-6") => {
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

  const handleAudioToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!file.file_url) {
      // File URL not loaded yet, need to preview first
      onPreview(file.id);
      return;
    }
    
    if (!playingAudio) {
      const audio = new Audio(file.file_url);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      audio.addEventListener('error', (e) => {
        console.error(`Audio load error for ${file.title}:`, e);
      });
      
      setPlayingAudio(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        playingAudio.pause();
        setIsPlaying(false);
      } else {
        playingAudio.play();
        setIsPlaying(true);
      }
    }
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm("Are you sure you want to delete this file?")) {
      await onDelete(file.id);
    }
  };

  const handlePreview = () => {
    onPreview(file.id);
  };

  const handleEditClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditingTitle(true);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer relative" onClick={handlePreview}>
      {/* Edit Pencil - Always visible when canEdit is true */}
      {canEdit && onUpdateTitle && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEditClick}
          onTouchStart={handleEditClick}
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm"
        >
          <Edit className="h-4 w-4 text-gray-700" />
        </Button>
      )}

      <div className="relative aspect-[3/2] bg-muted/40 overflow-hidden">
        {isImage && file.file_url && !imageError ? (
          <img 
            src={file.file_url} 
            alt={file.title}
            loading="lazy"
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
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
              onClick={handleAudioToggle}
              className="h-12 w-12 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-gray-800" />
              ) : (
                <Play className="h-6 w-6 text-gray-800 ml-0.5" />
              )}
            </Button>
          </div>
        )}
        
        {/* Regular overlay with actions */}
        <div className={`absolute inset-0 bg-black/60 ${isAudio ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex items-center justify-center gap-2`}>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handlePreview();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {file.file_url && (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = file.file_url!;
                a.download = file.title;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          {canDelete && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <CardContent className="p-3">
        {canEdit && onUpdateTitle && isEditingTitle ? (
          <InlineMediaTitleEdit
            title={file.title}
            onSave={async (newTitle) => {
              await onUpdateTitle(file.id, newTitle);
              setIsEditingTitle(false);
            }}
            className="mb-1"
          />
        ) : (
          <h3 className="font-medium text-sm truncate mb-1">{file.title}</h3>
        )}
        
        <p className="text-xs text-muted-foreground truncate mb-2">
          {file.title.split('.').pop()}
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
}
