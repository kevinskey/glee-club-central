
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/utils/mediaUtils";
import { FileText, Image, Music, Video, Library } from "lucide-react";

interface MediaTypeDropdownProps {
  selected: MediaType | "all";
  onSelect: (type: MediaType | "all") => void;
}

export function MediaTypeDropdown({ selected, onSelect }: MediaTypeDropdownProps) {
  const getMediaTypeIcon = (type: MediaType | "all") => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "all":
      default:
        return <Library className="h-4 w-4" />;
    }
  };

  const getMediaTypeLabel = (type: MediaType | "all") => {
    switch (type) {
      case "pdf":
        return "Documents";
      case "image":
        return "Images";
      case "audio":
        return "Audio";
      case "video":
        return "Video";
      case "all":
      default:
        return "All Files";
    }
  };

  const icon = getMediaTypeIcon(selected);
  const label = getMediaTypeLabel(selected);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>File Types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onSelect("all")} className="flex gap-2">
          <Library className="h-4 w-4" />
          <span>All Files</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("pdf")} className="flex gap-2">
          <FileText className="h-4 w-4" />
          <span>Documents</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("audio")} className="flex gap-2">
          <Music className="h-4 w-4" />
          <span>Audio</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("image")} className="flex gap-2">
          <Image className="h-4 w-4" />
          <span>Images</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("video")} className="flex gap-2">
          <Video className="h-4 w-4" />
          <span>Video</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
