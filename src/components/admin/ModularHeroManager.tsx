
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Images, Plus, Settings, Eye, FolderPlus } from 'lucide-react';
import { ModularHeroSection } from '@/components/hero/ModularHeroSection';
import { useModularHero } from '@/hooks/useModularHero';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaGridView } from '@/components/media/MediaGridView';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HeroCategory {
  name: string;
  label: string;
  description: string;
  imageCount: number;
}

export function ModularHeroManager() {
  const [selectedCategory, setSelectedCategory] = useState<string>('hero-homepage');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSelectMediaOpen, setIsSelectMediaOpen] = useState(false);
  const [heroCategories, setHeroCategories] = useState<HeroCategory[]>([]);

  const { images, isLoading, addImageToHero, removeImageFromHero, reorderImages } = useModularHero(selectedCategory);
  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();

  useEffect(() => {
    fetchHeroCategories();
    fetchAllMedia();
  }, []);

  const fetchHeroCategories = async () => {
    // Get all unique hero folders from media library
    const { data } = await supabase
      .from('media_library')
      .select('folder')
      .like('folder', 'hero-%')
      .not('folder', 'is', null);

    if (data) {
      const uniqueFolders = [...new Set(data.map(item => item.folder))];
      const categories: HeroCategory[] = [];

      for (const folder of uniqueFolders) {
        const { data: images } = await supabase
          .from('media_library')
          .select('id')
          .eq('folder', folder)
          .like('file_type', 'image%');

        categories.push({
          name: folder as string,
          label: folder?.replace('hero-', '').replace('-', ' ').toUpperCase() || '',
          description: `Hero section for ${folder?.replace('hero-', '')} page`,
          imageCount: images?.length || 0
        });
      }

      // Add default categories if they don't exist
      const defaultCategories = [
        { name: 'hero-homepage', label: 'HOMEPAGE', description: 'Hero section for homepage' },
        { name: 'hero-about', label: 'ABOUT', description: 'Hero section for about page' },
        { name: 'hero-events', label: 'EVENTS', description: 'Hero section for events page' },
        { name: 'hero-contact', label: 'CONTACT', description: 'Hero section for contact page' }
      ];

      for (const defaultCat of defaultCategories) {
        if (!categories.find(cat => cat.name === defaultCat.name)) {
          categories.push({ ...defaultCat, imageCount: 0 });
        }
      }

      setHeroCategories(categories.sort((a, b) => a.label.localeCompare(b.label)));
    }
  };

  const createNewHeroCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const categoryName = `hero-${newCategoryName.toLowerCase().replace(/\s+/g, '-')}`;
    
    if (heroCategories.find(cat => cat.name === categoryName)) {
      toast.error('Category already exists');
      return;
    }

    const newCategory: HeroCategory = {
      name: categoryName,
      label: newCategoryName.toUpperCase(),
      description: `Hero section for ${newCategoryName}`,
      imageCount: 0
    };

    setHeroCategories(prev => [...prev, newCategory].sort((a, b) => a.label.localeCompare(b.label)));
    setSelectedCategory(categoryName);
    setNewCategoryName('');
    setIsCreateDialogOpen(false);
    toast.success(`Created hero category: ${newCategoryName}`);
  };

  const handleAddImageToHero = async (mediaId: string) => {
    await addImageToHero(mediaId);
    setIsSelectMediaOpen(false);
    await fetchHeroCategories(); // Refresh counts
  };

  const handleRemoveImageFromHero = async (mediaId: string) => {
    await removeImageFromHero(mediaId);
    await fetchHeroCategories(); // Refresh counts
  };

  const availableImages = filteredMediaFiles.filter(
    file => file.file_type?.startsWith('image/') && file.folder !== selectedCategory
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Modular Hero Section Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Hero Categories</h3>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Hero Category</DialogTitle>
                      <DialogDescription>
                        Create a new hero section category (e.g., "About", "Contact", "Gallery")
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Category name (e.g., About)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && createNewHeroCategory()}
                      />
                      <div className="flex gap-2">
                        <Button onClick={createNewHeroCategory}>Create Category</Button>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {heroCategories.map((category) => (
                  <Card
                    key={category.name}
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category.name 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{category.label}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {category.imageCount}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Category Management */}
            <Tabs defaultValue="manage" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manage">Manage Images</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="manage" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Managing: {heroCategories.find(cat => cat.name === selectedCategory)?.label}
                  </h3>
                  <Dialog open={isSelectMediaOpen} onOpenChange={setIsSelectMediaOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Images
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>Add Images to Hero Section</DialogTitle>
                        <DialogDescription>
                          Select images from your media library to add to this hero section
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto">
                        {availableImages.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {availableImages.map((mediaFile) => (
                              <div
                                key={mediaFile.id}
                                className="relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200"
                                onClick={() => handleAddImageToHero(mediaFile.id)}
                              >
                                <div className="aspect-video">
                                  <img
                                    src={mediaFile.file_url}
                                    alt={mediaFile.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  />
                                </div>
                                <div className="p-2 bg-background/95 backdrop-blur">
                                  <p className="text-sm font-medium truncate">{mediaFile.title}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No available images</p>
                            <p className="text-sm">All images are already assigned to hero sections</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Current Hero Images */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading hero images...</div>
                  ) : images.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Images className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-xl mb-2">No images in this hero section</h3>
                      <p className="text-muted-foreground mb-6">
                        Add images from your media library to create this hero section
                      </p>
                      <Button onClick={() => setIsSelectMediaOpen(true)}>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Images
                      </Button>
                    </div>
                  ) : (
                    <MediaGridView
                      mediaFiles={images}
                      canEdit={true}
                      canDelete={true}
                      onDelete={handleRemoveImageFromHero}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hero Section Preview</h3>
                  
                  {/* Slideshow Preview */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Slideshow Mode</h4>
                    <ModularHeroSection
                      category={selectedCategory}
                      displayMode="slideshow"
                      height="300px"
                      overlayTitle="Sample Hero Title"
                      overlaySubtitle="This is how your hero section will look"
                    />
                  </div>

                  {/* Single Image Preview */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Single Image Mode</h4>
                    <ModularHeroSection
                      category={selectedCategory}
                      displayMode="single"
                      height="200px"
                      showOverlay={false}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
