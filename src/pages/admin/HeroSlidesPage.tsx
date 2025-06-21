import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Plus, Upload, MoveUp, MoveDown, Edit, Trash2, Settings } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { AddSlideModal } from '@/components/admin/AddSlideModal';
import { SliderSpacingControls } from '@/components/admin/SliderSpacingControls';
import { toast } from 'sonner';

export default function HeroSlidesPage() {
  const { slides, loading, updateSlideVisibility, updateSlideOrder, fetchHeroSlides } = useHeroSlides();
  const { mediaFiles, isLoading: mediaLoading } = useMediaLibrary();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);

  const handleVisibilityToggle = async (slideId: string, visible: boolean) => {
    await updateSlideVisibility(slideId, visible);
  };

  const handleMoveUp = async (slideId: string, currentOrder: number) => {
    if (currentOrder > 0) {
      await updateSlideOrder(slideId, currentOrder - 1);
    }
  };

  const handleMoveDown = async (slideId: string, currentOrder: number) => {
    const maxOrder = slides.length - 1;
    if (currentOrder < maxOrder) {
      await updateSlideOrder(slideId, currentOrder + 1);
    }
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    fetchHeroSlides();
    toast.success('Media uploaded successfully');
  };

  const handleSlideAdded = () => {
    fetchHeroSlides();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Hero Slides Manager"
        description="Manage the hero slider on your landing page. Control slides, their order, and spacing."
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowAddSlideModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Slide
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="slides" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="slides">Slides Management</TabsTrigger>
          <TabsTrigger value="spacing">
            <Settings className="h-4 w-4 mr-2" />
            Spacing Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="mt-6">
          {/* Slides Overview */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Slides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{slides.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Visible Slides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {slides.filter(s => s.visible).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Hidden Slides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {slides.filter(s => !s.visible).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Media Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mediaFiles.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-4">
            {slides.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-500 mb-4">No slides found</div>
                  <Button onClick={() => setShowAddSlideModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Slide
                  </Button>
                </CardContent>
              </Card>
            ) : (
              slides.map((slide, index) => (
                <Card key={slide.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Slide Preview */}
                    <div className="w-48 h-32 bg-gray-100 flex-shrink-0">
                      {slide.media?.file_url ? (
                        <img 
                          src={slide.media.file_url} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Slide Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{slide.title}</h3>
                            <Badge variant={slide.visible ? "default" : "secondary"}>
                              {slide.visible ? "Visible" : "Hidden"}
                            </Badge>
                            <Badge variant="outline">Order: {slide.slide_order}</Badge>
                          </div>
                          {slide.description && (
                            <p className="text-sm text-gray-600 mb-2">{slide.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Position: {slide.text_position || 'center'}</span>
                            <span>Alignment: {slide.text_alignment || 'center'}</span>
                            {slide.button_text && (
                              <span>Button: {slide.button_text}</span>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          {/* Visibility Toggle */}
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={slide.visible}
                              onCheckedChange={(checked) => handleVisibilityToggle(slide.id, checked)}
                            />
                            {slide.visible ? (
                              <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                          </div>

                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveUp(slide.id, slide.slide_order)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveDown(slide.id, slide.slide_order)}
                              disabled={index === slides.length - 1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Edit/Delete */}
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="spacing" className="mt-6">
          <SliderSpacingControls />
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <UploadMediaModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUploadComplete={handleUploadComplete}
        defaultCategory="hero-slides"
      />

      {/* Add Slide Modal */}
      <AddSlideModal
        open={showAddSlideModal}
        onOpenChange={setShowAddSlideModal}
        onSlideAdded={handleSlideAdded}
      />
    </div>
  );
}
