
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListMusic, Plus, Loader2, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Setlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  sheet_music_ids: string[];
}

interface SetlistSelectorProps {
  setlists: Setlist[];
  activeSetlist: Setlist | null;
  isLoading: boolean;
  isError?: boolean;
  onSelect: (setlist: Setlist) => void;
  onDelete: (setlistId: string) => void;
  onCreateNew: () => void;
}

export const SetlistSelector = ({
  setlists,
  activeSetlist,
  isLoading,
  isError = false,
  onSelect,
  onDelete,
  onCreateNew
}: SetlistSelectorProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-4 flex-col text-center">
        <AlertCircle className="h-5 w-5 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground">Failed to load setlists</p>
        <Button 
          variant="link" 
          size="sm" 
          className="mt-1"
          onClick={onCreateNew}
        >
          Try creating a new one
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Your Setlists</h3>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          onClick={onCreateNew}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>
      
      {setlists.length === 0 ? (
        <div className="bg-muted/50 rounded-md p-4 text-center">
          <ListMusic className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            You don't have any setlists yet.
          </p>
          <Button 
            variant="link" 
            onClick={onCreateNew}
            className="mt-2"
          >
            Create your first setlist
          </Button>
        </div>
      ) : (
        <Select
          value={activeSetlist?.id || ""}
          onValueChange={(value) => {
            const selected = setlists.find(s => s.id === value);
            if (selected) onSelect(selected);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a setlist" />
          </SelectTrigger>
          <SelectContent>
            {setlists.map((setlist) => (
              <SelectItem key={setlist.id} value={setlist.id}>
                {setlist.name}
                <span className="text-xs text-muted-foreground ml-2">
                  ({setlist.sheet_music_ids?.length || 0})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
