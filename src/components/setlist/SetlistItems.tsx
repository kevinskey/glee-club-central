
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { X, FileText, ArrowDown, ArrowUp, Loader2 } from "lucide-react";

interface Setlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  sheet_music_ids: string[];
}

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
}

interface SetlistItemsProps {
  setlist: Setlist;
  onItemClick: (id: string) => void;
  onRemoveItem: (id: string) => void;
  currentSheetMusicId?: string;
}

export const SetlistItems = ({ 
  setlist, 
  onItemClick, 
  onRemoveItem,
  currentSheetMusicId 
}: SetlistItemsProps) => {
  const [sheetMusicItems, setSheetMusicItems] = useState<SheetMusic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSheetMusicItems();
  }, [setlist]);

  const loadSheetMusicItems = async () => {
    if (!setlist.sheet_music_ids || setlist.sheet_music_ids.length === 0) {
      setSheetMusicItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('id, title, composer, file_url')
        .in('id', setlist.sheet_music_ids);

      if (error) throw error;

      if (data) {
        // Order the items according to the order in setlist.sheet_music_ids
        const orderedItems = setlist.sheet_music_ids.map(
          id => data.find(item => item.id === id)
        ).filter(Boolean) as SheetMusic[];
        
        setSheetMusicItems(orderedItems);
      }
    } catch (error) {
      console.error("Error loading sheet music items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (!setlist.sheet_music_ids) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= setlist.sheet_music_ids.length) return;
    
    // Create a new array with the items swapped
    const newOrder = [...setlist.sheet_music_ids];
    const temp = newOrder[index];
    newOrder[index] = newOrder[newIndex];
    newOrder[newIndex] = temp;
    
    try {
      // Using explicit typing with the setlists table
      const { error } = await supabase
        .from('setlists')
        .update({ sheet_music_ids: newOrder } as any)
        .eq('id', setlist.id) as any;

      if (error) throw error;
      
      // Update the local state
      const updatedSetlist = { ...setlist, sheet_music_ids: newOrder };
      const updatedItems = newOrder.map(
        id => sheetMusicItems.find(item => item.id === id)
      ).filter(Boolean) as SheetMusic[];
      
      setSheetMusicItems(updatedItems);
    } catch (error) {
      console.error("Error reordering setlist items:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sheetMusicItems.length === 0) {
    return (
      <div className="bg-muted/50 rounded-md p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          This setlist is empty.
        </p>
        {currentSheetMusicId && (
          <p className="text-xs text-muted-foreground mt-2">
            Add the current sheet music to get started.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Items in "{setlist.name}"
      </h3>
      <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
        {sheetMusicItems.map((item, index) => (
          <li 
            key={item.id}
            className={`
              flex items-center justify-between 
              gap-2 p-2 rounded-md border 
              ${currentSheetMusicId === item.id ? 'bg-primary/10 border-primary/30' : ''}
            `}
          >
            <button 
              className="flex-1 flex flex-col items-start text-left"
              onClick={() => onItemClick(item.id)}
            >
              <span className="font-medium truncate w-full">{item.title}</span>
              <span className="text-xs text-muted-foreground truncate w-full">{item.composer}</span>
            </button>
            <div className="flex items-center shrink-0">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="h-8 w-8"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => moveItem(index, 'down')}
                disabled={index === sheetMusicItems.length - 1}
                className="h-8 w-8"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveItem(item.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
