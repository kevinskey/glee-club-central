import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SetlistItems } from "./SetlistItems";
import { SetlistSelector } from "./SetlistSelector";
import { FileText, Plus, Save } from "lucide-react";

interface SetlistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSheetMusicId?: string;
  onSetlistsChange?: () => void;
}

// Define explicit interface for our setlist data
interface Setlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  sheet_music_ids: string[];
}

export const SetlistDrawer = ({ 
  open, 
  onOpenChange, 
  currentSheetMusicId,
  onSetlistsChange 
}: SetlistDrawerProps) => {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [activeSetlist, setActiveSetlist] = useState<Setlist | null>(null);
  const [newSetlistName, setNewSetlistName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load setlists when drawer opens
  useEffect(() => {
    if (open && user) {
      loadSetlists();
    }
  }, [open, user]);

  const loadSetlists = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Now that the setlists table exists in the database, we can query it
      const { data, error } = await supabase
        .from('setlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) as any;

      if (error) throw error;

      if (data && data.length > 0) {
        setSetlists(data as unknown as Setlist[]);
        setActiveSetlist(data[0] as unknown as Setlist);
      } else {
        setSetlists([]);
        setActiveSetlist(null);
      }
    } catch (error) {
      console.error("Error loading setlists:", error);
      toast({
        title: "Error loading setlists",
        description: "Failed to load your setlists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewSetlist = async () => {
    if (!user) return;
    if (!newSetlistName.trim()) {
      toast({
        title: "Missing setlist name",
        description: "Please enter a name for your setlist.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Initialize with current sheet music if provided
      const initialSheetMusicIds = currentSheetMusicId ? [currentSheetMusicId] : [];

      // Using explicit typing with the setlists table
      const { data, error } = await supabase
        .from('setlists')
        .insert({
          name: newSetlistName,
          user_id: user.id,
          sheet_music_ids: initialSheetMusicIds
        } as any)
        .select() as any;

      if (error) throw error;

      if (data && data.length > 0) {
        toast({
          title: "Setlist created",
          description: `"${newSetlistName}" has been created.`
        });
        
        // Add new setlist to the list and select it
        const newSetlist = data[0] as unknown as Setlist;
        setSetlists([newSetlist, ...setlists]);
        setActiveSetlist(newSetlist);
        setIsCreatingNew(false);
        setNewSetlistName("");
        
        if (onSetlistsChange) {
          onSetlistsChange();
        }
      }
    } catch (error) {
      console.error("Error creating setlist:", error);
      toast({
        title: "Error creating setlist",
        description: "Failed to create the setlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToSetlist = async () => {
    if (!user || !activeSetlist || !currentSheetMusicId) return;

    // Check if already in setlist
    if (activeSetlist.sheet_music_ids && activeSetlist.sheet_music_ids.includes(currentSheetMusicId)) {
      toast({
        title: "Already added",
        description: "This sheet music is already in the selected setlist.",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Add the current sheet music to the setlist
      const updatedIds = [...(activeSetlist.sheet_music_ids || []), currentSheetMusicId];
      
      // Using explicit typing with the setlists table
      const { error } = await supabase
        .from('setlists')
        .update({ sheet_music_ids: updatedIds } as any)
        .eq('id', activeSetlist.id) as any;

      if (error) throw error;

      // Update local state
      const updatedSetlist = { ...activeSetlist, sheet_music_ids: updatedIds };
      setActiveSetlist(updatedSetlist);
      setSetlists(setlists.map(sl => sl.id === updatedSetlist.id ? updatedSetlist : sl));
      
      toast({
        title: "Added to setlist",
        description: `Added to "${activeSetlist.name}".`,
      });
    } catch (error) {
      console.error("Error updating setlist:", error);
      toast({
        title: "Error updating setlist",
        description: "Failed to add to setlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromSetlist = async (sheetMusicId: string) => {
    if (!user || !activeSetlist) return;

    setIsSaving(true);
    try {
      // Remove the sheet music from the setlist
      const updatedIds = activeSetlist.sheet_music_ids.filter(id => id !== sheetMusicId);
      
      // Using explicit typing with the setlists table
      const { error } = await supabase
        .from('setlists')
        .update({ sheet_music_ids: updatedIds } as any)
        .eq('id', activeSetlist.id) as any;

      if (error) throw error;

      // Update local state
      const updatedSetlist = { ...activeSetlist, sheet_music_ids: updatedIds };
      setActiveSetlist(updatedSetlist);
      setSetlists(setlists.map(sl => sl.id === updatedSetlist.id ? updatedSetlist : sl));
      
      toast({
        title: "Removed from setlist",
        description: `Removed from "${activeSetlist.name}".`,
      });
      
      // Notify parent component about setlists change
      if (onSetlistsChange) {
        onSetlistsChange();
      }
    } catch (error) {
      console.error("Error updating setlist:", error);
      toast({
        title: "Error updating setlist",
        description: "Failed to update setlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSetlist = async (setlistId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this setlist?")) return;

    try {
      // Using explicit typing with the setlists table
      const { error } = await supabase
        .from('setlists')
        .delete()
        .eq('id', setlistId) as any;

      if (error) throw error;

      // Update local state
      const updatedSetlists = setlists.filter(sl => sl.id !== setlistId);
      setSetlists(updatedSetlists);
      
      // If the active setlist was deleted, select another one if available
      if (activeSetlist?.id === setlistId) {
        setActiveSetlist(updatedSetlists.length > 0 ? updatedSetlists[0] : null);
      }
      
      toast({
        title: "Setlist deleted",
        description: "The setlist has been deleted.",
      });
      
      // Notify parent component about setlists change
      if (onSetlistsChange) {
        onSetlistsChange();
      }
    } catch (error) {
      console.error("Error deleting setlist:", error);
      toast({
        title: "Error deleting setlist",
        description: "Failed to delete the setlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetlistSelected = (setlist: Setlist) => {
    setActiveSetlist(setlist);
    setIsCreatingNew(false);
  };

  const navigateToSheetMusic = (sheetMusicId: string) => {
    onOpenChange(false);
    navigate(`/dashboard/sheet-music/${sheetMusicId}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sheet Music Setlists
          </SheetTitle>
          <SheetDescription>
            Create and manage your sheet music setlists for performances or practice.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-4">
          {/* Setlist selector */}
          <SetlistSelector 
            setlists={setlists}
            activeSetlist={activeSetlist}
            isLoading={isLoading}
            onSelect={handleSetlistSelected}
            onDelete={handleDeleteSetlist}
            onCreateNew={() => setIsCreatingNew(true)}
          />
          
          {/* Create new setlist form */}
          {isCreatingNew && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Create New Setlist</h3>
              <div className="space-y-2">
                <Label htmlFor="setlist-name">Setlist Name</Label>
                <Input
                  id="setlist-name"
                  value={newSetlistName}
                  onChange={(e) => setNewSetlistName(e.target.value)}
                  placeholder="Enter a name for your setlist"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingNew(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateNewSetlist}
                  disabled={isSaving || !newSetlistName.trim()}
                >
                  {isSaving ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" /> 
                      Create Setlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Add current sheet music to setlist */}
          {currentSheetMusicId && activeSetlist && !isCreatingNew && (
            <div className="border rounded-md p-4">
              <Button 
                onClick={handleAddToSetlist}
                disabled={isSaving || (activeSetlist.sheet_music_ids && activeSetlist.sheet_music_ids.includes(currentSheetMusicId))}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> 
                Add Current Sheet to "{activeSetlist.name}"
              </Button>
            </div>
          )}
          
          {/* Setlist items */}
          {activeSetlist && !isCreatingNew && (
            <SetlistItems
              setlist={activeSetlist}
              onItemClick={navigateToSheetMusic}
              onRemoveItem={handleRemoveFromSetlist}
              currentSheetMusicId={currentSheetMusicId}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
