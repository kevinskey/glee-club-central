
import React from "react";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { MediaFilesSection } from "./MediaFilesSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MediaAccordionViewProps {
  files: MediaFile[];
  mediaTypes: MediaType[];
  viewMode: "grid" | "list";
  onDelete: () => void;
}

export function MediaAccordionView({ 
  files, 
  mediaTypes, 
  viewMode, 
  onDelete 
}: MediaAccordionViewProps) {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="sheet_music">
      {mediaTypes.map((mediaType) => {
        const filesOfType = files.filter(
          file => getMediaType(file.file_type) === mediaType
        );
        
        if (filesOfType.length === 0) return null;
        
        return (
          <AccordionItem key={mediaType} value={mediaType}>
            <AccordionTrigger className="text-lg">
              {getMediaTypeLabel(mediaType)} ({filesOfType.length})
            </AccordionTrigger>
            <AccordionContent>
              <MediaFilesSection
                files={filesOfType}
                mediaType={mediaType}
                viewMode={viewMode}
                onDelete={onDelete}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
