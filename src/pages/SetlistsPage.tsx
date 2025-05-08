
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { ListMusic, Plus, Search, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function SetlistsPage() {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSetlistName, setNewSetlistName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewSetlist, setViewSetlist] = useState<Setlist | null>(null);
  const [setlistItems, setSetlistItems] = useState<SheetMusic[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadSetlists();
    }
  }, [user]);

  const loadSetlists = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('setlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) as any;

      if (error) throw error;

      if (data) {
        setSetlists(data as Setlist[]);
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

  const createNewSetlist = async () => {
    if (!user || !newSetlistName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('setlists')
        .insert({
          name: newSetlistName,
          user_id: user.id,
          sheet_music_ids: []
        } as any)
        .select() as any;

      if (error) throw error;

      if (data) {
        toast({
          title: "Setlist created",
          description: `"${newSetlistName}" has been created.`
        });
        
        setSetlists([data[0] as Setlist, ...setlists]);
        setNewSetlistName("");
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating setlist:", error);
      toast({
        title: "Error creating setlist",
        description: "Failed to create the setlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteSetlist = async (setlistId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!user || !confirm("Are you sure you want to delete this setlist?")) return;

    try {
      const { error } = await supabase
        .from('setlists')
        .delete()
        .eq('id', setlistId) as any;

      if (error) throw error;

      setSetlists(setlists.filter(sl => sl.id !== setlistId));
      
      toast({
        title: "Setlist deleted",
        description: "The setlist has been deleted."
      });
    } catch (error) {
      console.error("Error deleting setlist:", error);
      toast({
        title: "Error deleting setlist",
        description: "Failed to delete the setlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const viewSetlistDetails = async (setlist: Setlist) => {
    setViewSetlist(setlist);
    setIsViewDialogOpen(true);
    
    if (!setlist.sheet_music_ids || setlist.sheet_music_ids.length === 0) {
      setSetlistItems([]);
      return;
    }

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
        
        setSetlistItems(orderedItems);
      }
    } catch (error) {
      console.error("Error loading setlist items:", error);
      toast({
        title: "Error loading setlist items",
        description: "Failed to load the setlist items. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigateToSheetMusic = (sheetMusicId: string) => {
    setIsViewDialogOpen(false);
    navigate(`/dashboard/sheet-music/${sheetMusicId}`);
  };

  const filteredSetlists = setlists.filter(setlist => 
    setlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Setlists" 
        description="Manage your sheet music collections for performances and practice"
        icon={<ListMusic className="h-6 w-6" />}
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Setlist
          </Button>
        }
      />

      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search setlists..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="h-[200px] animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : filteredSetlists.length === 0 ? (
            <div className="text-center py-12">
              <ListMusic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No setlists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term or" : "Get started by"} creating a new setlist.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Setlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSetlists.map((setlist) => (
                <Card 
                  key={setlist.id} 
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => viewSetlistDetails(setlist)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="mr-2">{setlist.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => deleteSetlist(setlist.id, e)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {new Date(setlist.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {setlist.sheet_music_ids?.length || 0} {(setlist.sheet_music_ids?.length || 0) === 1 ? 'item' : 'items'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => viewSetlistDetails(setlist)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Setlist
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-muted/50 rounded-md" />
              ))}
            </div>
          ) : filteredSetlists.length === 0 ? (
            <div className="text-center py-12">
              <ListMusic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No setlists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term or" : "Get started by"} creating a new setlist.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Setlist
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSetlists.map((setlist) => (
                    <TableRow 
                      key={setlist.id} 
                      className="cursor-pointer hover:bg-muted/80"
                      onClick={() => viewSetlistDetails(setlist)}
                    >
                      <TableCell className="font-medium">{setlist.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {setlist.sheet_music_ids?.length || 0} {(setlist.sheet_music_ids?.length || 0) === 1 ? 'item' : 'items'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(setlist.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewSetlistDetails(setlist);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => deleteSetlist(setlist.id, e)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Setlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Setlist</DialogTitle>
            <DialogDescription>
              Create a new setlist to organize your sheet music for performances or practice.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="setlist-name">Setlist Name</Label>
              <Input
                id="setlist-name"
                value={newSetlistName}
                onChange={(e) => setNewSetlistName(e.target.value)}
                placeholder="Enter a name for your setlist"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewSetlist} disabled={!newSetlistName.trim()}>
              Create Setlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Setlist Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListMusic className="h-5 w-5" />
              {viewSetlist?.name}
            </DialogTitle>
            <DialogDescription>
              Created {viewSetlist && new Date(viewSetlist.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              Items in Setlist
            </h3>
            
            <ScrollArea className="h-[50vh]">
              {setlistItems.length === 0 ? (
                <div className="bg-muted/50 rounded-md p-6 text-center">
                  <ListMusic className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    This setlist is empty.
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      navigate('/dashboard/sheet-music');
                    }}
                    className="mt-2"
                  >
                    Add sheet music to your setlist
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2 pr-4">
                  {setlistItems.map((item) => (
                    <li 
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigateToSheetMusic(item.id)}
                    >
                      <div className="flex-1 flex flex-col items-start">
                        <span className="font-medium truncate w-full">{item.title}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{item.composer}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              navigate('/dashboard/sheet-music');
            }}>
              Go to Sheet Music
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
