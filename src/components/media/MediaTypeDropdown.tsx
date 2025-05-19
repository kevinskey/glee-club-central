
import React from "react";
import { FileType, Image, FileText, Video, Music, Folder } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaType, getMediaTypeLabel } from "@/utils/mediaUtils";

interface MediaTypeDropdownProps {
  selected: MediaType | "all";
  onSelect: (mediaType: MediaType | "all") => void;
}

export function MediaTypeDropdown({ selected, onSelect }: MediaTypeDropdownProps) {
  const getIcon = (type: MediaType | "all") => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "all":
        return <Folder className="h-4 w-4" />;
      default:
        return <FileType className="h-4 w-4" />;
    }
  };

  return (
    <Select value={selected} onValueChange={(value) => onSelect(value as MediaType | "all")}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          {getIcon(selected)}
          <SelectValue placeholder="All Media Types" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span>All Media Types</span>
          </div>
        </SelectItem>
        <SelectItem value="image">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Images</span>
          </div>
        </SelectItem>
        <SelectItem value="pdf">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div>
        </SelectItem>
        <SelectItem value="video">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </div>
        </SelectItem>
        <SelectItem value="audio">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Audio</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
