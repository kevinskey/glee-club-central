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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  Calendar, 
  Edit, 
  Plus, 
  Trash, 
  Bot,
  Sparkles,
  Rss,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AINewsGenerator } from "@/components/admin/AINewsGenerator";
import { EnhancedNewsSourceManager } from "@/components/admin/EnhancedNewsSourceManager";
import { AINewsContent } from "@/hooks/useAINewsGeneration";

interface NewsItem {
  id: string;
  headline: string;
  content?: string;
  active: boolean;
  start_date: string;
  end_date?: string;
  priority: number;
  generated_by_ai: boolean;
  ai_prompt?: string;
  created_at: string;
}

export default function NewsItemsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState("manage");
  
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

  const handleOpenAIDialog = () => {
    setIsAIDialogOpen(true);
  };
  
  const resetForm = () => {
    setHeadline("");
    setContent("");
    setActive(true);
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setEndDate("");
    setPriority(1);
  };

  const handleAIGenerated = (aiContent: AINewsContent) => {
    // Auto-fill form with AI generated content
    setHeadline(aiContent.headline);
    setContent(aiContent.content);
    setActive(true);
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setPriority(1);
    
    // Close AI dialog and open regular form dialog
    setIsAIDialogOpen(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
    
    toast.success("Form filled with AI-generated content");
  };

  const handleAISaved = () => {
    // Refresh the news items list when AI saves directly
    fetchNewsItems();
    setIsAIDialogOpen(false);
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
            priority,
            generated_by_ai: false
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
        description="Manage news headlines and configure news sources for the scrolling ticker."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Manage Items</TabsTrigger>
          <TabsTrigger value="sources">News Sources</TabsTrigger>
          <TabsTrigger value="settings">Ticker Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <Card>
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
                <div className="flex gap-2">
                  <Button onClick={handleOpenAIDialog} variant="outline">
                    <Bot className="mr-2 h-4 w-4" /> 
                    Generate with AI
                  </Button>
                  <Button onClick={handleOpenAddDialog}>
                    <Plus className="mr-2 h-4 w-4" /> 
                    Add Manually
                  </Button>
                </div>
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
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleOpenAIDialog} variant="outline">
                      <Bot className="mr-2 h-4 w-4" /> 
                      Generate with AI
                    </Button>
                    <Button onClick={handleOpenAddDialog}>
                      <Plus className="mr-2 h-4 w-4" /> 
                      Add Manually
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Headline</TableHead>
                        <TableHead>Source</TableHead>
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
                            {item.generated_by_ai ? (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                AI Generated
                              </Badge>
                            ) : (
                              <Badge variant="outline">Manual</Badge>
                            )}
                          </TableCell>
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
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <EnhancedNewsSourceManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Ticker Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scroll Speed</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="slow">Slow (30s)</option>
                    <option value="normal">Normal (25s)</option>
                    <option value="fast">Fast (20s)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Maximum Items</Label>
                  <Input type="number" defaultValue="5" min="1" max="20" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-hide Ticker</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide ticker after specified time
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hide After (seconds)</Label>
                  <Input type="number" defaultValue="8" min="1" max="60" />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input type="color" defaultValue="#6B46C1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Generation Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              Generate News with AI
            </DialogTitle>
            <DialogDescription>
              Use AI to generate compelling news headlines and content for your ticker.
            </DialogDescription>
          </DialogHeader>
          
          <AINewsGenerator 
            onNewsGenerated={handleAIGenerated}
            onNewsSaved={handleAISaved}
          />
        </DialogContent>
      </Dialog>
      
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
