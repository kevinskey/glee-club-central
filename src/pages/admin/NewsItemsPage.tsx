
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertTriangle, Calendar, Edit, Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  headline: string;
  content?: string;
  active: boolean;
  start_date: string;
  end_date?: string;
  priority: number;
  created_at: string;
}

export default function NewsItemsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<NewsItem | null>(null);
  
  // Form state
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState(1);
  
  useEffect(() => {
    fetchNewsItems();
  }, []);
  
  const fetchNewsItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('priority', { ascending: false });
        
      if (error) throw error;
      
      setNewsItems(data || []);
    } catch (error) {
      console.error("Error fetching news items:", error);
      toast.error("Failed to load news items");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setCurrentItem(null);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (item: NewsItem) => {
    setHeadline(item.headline);
    setContent(item.content || "");
    setActive(item.active);
    setStartDate(item.start_date.split('T')[0]);
    setEndDate(item.end_date ? item.end_date.split('T')[0] : "");
    setPriority(item.priority);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (item: NewsItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setHeadline("");
    setContent("");
    setActive(true);
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setEndDate("");
    setPriority(1);
  };
  
  const handleSave = async () => {
    if (!headline) {
      toast.error("Headline is required");
      return;
    }
    
    if (!startDate) {
      toast.error("Start date is required");
      return;
    }
    
    try {
      let result;
      
      if (currentItem) {
        // Update existing
        const { data, error } = await supabase
          .from('news_items')
          .update({
            headline,
            content,
            active,
            start_date: startDate,
            end_date: endDate || null,
            priority
          })
          .eq('id', currentItem.id);
          
        if (error) throw error;
        result = "updated";
      } else {
        // Create new
        const { data, error } = await supabase
          .from('news_items')
          .insert({
            headline,
            content,
            active,
            start_date: startDate,
            end_date: endDate || null,
            priority
          });
          
        if (error) throw error;
        result = "created";
      }
      
      toast.success(`News item ${result} successfully`);
      setIsDialogOpen(false);
      fetchNewsItems();
    } catch (error) {
      console.error("Error saving news item:", error);
      toast.error("Failed to save news item");
    }
  };
  
  const handleDelete = async () => {
    if (!currentItem) return;
    
    try {
      const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', currentItem.id);
        
      if (error) throw error;
      
      toast.success("News item deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchNewsItems();
    } catch (error) {
      console.error("Error deleting news item:", error);
      toast.error("Failed to delete news item");
    }
  };
  
  const toggleActive = async (item: NewsItem, newActiveState: boolean) => {
    try {
      const { error } = await supabase
        .from('news_items')
        .update({ active: newActiveState })
        .eq('id', item.id);
        
      if (error) throw error;
      
      // Update local state
      setNewsItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, active: newActiveState } : i)
      );
      
      toast.success(`News item ${newActiveState ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Error toggling news item state:", error);
      toast.error("Failed to update news item");
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <PageHeader 
        title="News Ticker Manager" 
        description="Manage news headlines displayed in the scrolling ticker on the landing page."
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>News Items</CardTitle>
          <CardDescription>
            Create and manage headlines that appear in the scrolling news ticker.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Currently Active Items: {newsItems.filter(item => item.active).length}
              </h3>
            </div>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add News Item
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              ))}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No news items found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Add your first news item to display in the ticker.
              </p>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add News Item
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.headline}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{formatDate(item.start_date)}</span>
                          {item.end_date && (
                            <>
                              <span className="mx-1">-</span>
                              <span>{formatDate(item.end_date)}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.priority}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={item.active}
                          onCheckedChange={(checked) => toggleActive(item, checked)}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(item)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleOpenDeleteDialog(item)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentItem ? "Edit News Item" : "Add News Item"}</DialogTitle>
            <DialogDescription>
              {currentItem ? "Update the news item details" : "Create a new news ticker headline"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Enter headline text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content (optional)</Label>
              <Textarea
                id="content"
                placeholder="Additional details (not shown in ticker)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date (optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority (higher numbers appear first)</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {currentItem ? "Save Changes" : "Create News Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete News Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this news item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && (
            <div className="py-4">
              <p className="font-medium">{currentItem.headline}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Created: {formatDate(currentItem.created_at)}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
