
import React from "react";
import { MediaFile } from "@/types/media";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, Download } from "lucide-react";
import { formatFileSize, getFileTypeIcon } from "@/utils/file-utils";

interface MediaAccordionViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (mediaId: string) => void;
}

export function MediaAccordionView({
  mediaFiles,
  canEdit = false,
  canDelete = false,
  onDelete
}: MediaAccordionViewProps) {
  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this media file?")) {
      onDelete(id);
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {mediaFiles.map((file) => {
        const FileTypeIcon = getFileTypeIcon(file.file_type);
        
        return (
          <AccordionItem key={file.id} value={file.id}>
            <AccordionTrigger className="hover:bg-accent/20 px-4">
              <div className="flex items-center w-full">
                <div className="mr-3">
                  <FileTypeIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium">{file.title}</span>
                </div>
                <Badge variant="outline" className="mr-4">
                  {file.file_type.split('/')[1]?.toUpperCase() || "FILE"}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex flex-col md:flex-row gap-4">
                {file.file_type.startsWith("image/") && (
                  <div className="md:w-1/3">
                    <img 
                      src={file.file_url} 
                      alt={file.title} 
                      className="w-full h-auto object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/400x225/e2e8f0/94a3b8?text=Image+Unavailable";
                      }}
                    />
                  </div>
                )}
                
                <div className={`${file.file_type.startsWith("image/") ? "md:w-2/3" : "w-full"}`}>
                  {file.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{file.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Type</h4>
                      <p className="text-sm text-muted-foreground">{file.file_type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Size</h4>
                      <p className="text-sm text-muted-foreground">{file.size && formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-2" /> View
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={file.file_url} download={file.title}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </a>
                    </Button>
                    
                    {canEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Edit functionality coming soon');
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    )}
                    
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => handleDelete(file.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
