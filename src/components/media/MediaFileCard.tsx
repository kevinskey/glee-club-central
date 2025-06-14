
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon, Pencil, Trash2, Music, ArrowRight, Play, Pause } from "lucide-react";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import { MediaFile } from "@/types/media";
import { getMediaType } from "@/utils/mediaUtils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaFileCardProps {
  file: MediaFile;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const MediaFileCard = ({
  file,
  onEdit,
  onDelete,
  onClick,
  canEdit = false,
  canDelete = false
}: MediaFileCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  
  // Determine the media type based on file_type
  const mediaType = getMediaType(file.file_type);
  
  // Get the formatted date
  const formattedDate = file.created_at 
    ? formatDistanceToNow(new Date(file.created_at), { addSuffix: true }) 
    : '';
  
  // Handle audio play/pause
  const toggleAudioPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!audio) {
      const newAudio = new Audio(file.file_url);
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Handle file click, with different behavior based on file type
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open the file in a new tab
      window.open(file.file_url, "_blank");
    }
  };
  
  // Handle delete confirmation
  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    if (onDelete) {
      onDelete(file.id);
    }
  };

  // Open in Sheet Music Library
  const openInSheetMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/sheet-music?media_id=${file.id}`);
  };

  const renderMediaPreview = () => {
    switch (mediaType) {
      case 'image':
        return (
          <img 
            src={file.file_url} 
            alt={file.title || 'Media file'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <svg class="h-16 w-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        );
      
      case 'pdf':
        return (
          <PDFThumbnail 
            url={file.file_url} 
            title={file.title || ''} 
            className="w-full h-full"
            aspectRatio={16/9}
          />
        );
      
      case 'audio':
        return (
          <div className="flex items-center justify-center h-full relative">
            <Music className="h-16 w-16 text-muted-foreground" />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={toggleAudioPlayback}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <FileIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        {/* Card Preview/Thumbnail */}
        <div 
          className="aspect-video bg-muted cursor-pointer overflow-hidden relative" 
          onClick={handleClick}
        >
          {renderMediaPreview()}
        </div>
        
        {/* Card Content */}
        <CardContent className="p-3 flex-1">
          <h3 className="font-medium text-sm truncate">{file.title}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          
          {file.category && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {file.category}
              </span>
            </div>
          )}
        </CardContent>
        
        {/* Card Footer */}
        <CardFooter className="p-3 pt-0 flex justify-between gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-grow"
            onClick={handleClick}
          >
            View
          </Button>
          
          <div className="flex gap-1">
            {mediaType === 'pdf' && (
              <Button
                variant="outline"
                size="sm"
                onClick={openInSheetMusic}
                className="flex-nowrap whitespace-nowrap"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Music Library</span>
              </Button>
            )}
            
            {canEdit && onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            {canDelete && onDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0 sm:mt-0 w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
