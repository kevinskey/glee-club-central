
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSlideDesigns } from '@/hooks/useSlideDesigns';
import { TemplateSelector } from './TemplateSelector';
import { WYSIWYGEditor } from './WYSIWYGEditor';
import { SlideTemplate, SlideDesign } from '@/types/slideDesign';
import { Layout, Plus, Edit, Eye, Trash2, Loader2, Image } from 'lucide-react';
import { toast } from 'sonner';

type EditorMode = 'select' | 'edit' | 'preview';

export function SlideDesignManager() {
  const { templates, designs, isLoading, createDesign, updateDesign, deleteDesign } = useSlideDesigns();
  const [mode, setMode] = useState<EditorMode>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate>();
  const [editingDesign, setEditingDesign] = useState<SlideDesign>();

  const handleSelectTemplate = (template: SlideTemplate) => {
    setSelectedTemplate(template);
    setEditingDesign(undefined);
    setMode('edit');
  };

  const handleCreateNew = () => {
    setSelectedTemplate(undefined);
    setEditingDesign(undefined);
    setMode('edit');
  };

  const handleEditDesign = (design: SlideDesign) => {
    const template = templates.find(t => t.id === design.template_id);
    setSelectedTemplate(template);
    setEditingDesign(design);
    setMode('edit');
  };

  const handleSaveDesign = async (designData: Partial<SlideDesign>) => {
    try {
      if (editingDesign) {
        await updateDesign(editingDesign.id, designData);
      } else {
        await createDesign(designData);
      }
      setMode('select');
      setSelectedTemplate(undefined);
      setEditingDesign(undefined);
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  const handleDeleteDesign = async (design: SlideDesign) => {
    if (window.confirm(`Are you sure you want to delete "${design.title}"?`)) {
      await deleteDesign(design.id);
    }
  };

  const handlePreview = () => {
    setMode('preview');
    toast.info('Preview mode - this would show the live slide preview');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading slide design system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Slide Design Manager</h1>
          <p className="text-muted-foreground">
            Create and manage custom slides for your homepage hero section
          </p>
        </div>
        {mode !== 'select' && (
          <Button onClick={() => setMode('select')} variant="outline">
            Back to Overview
          </Button>
        )}
      </div>

      <Tabs defaultValue="designs" className="w-full">
        <TabsList>
          <TabsTrigger value="designs">Active Designs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-4">
          {mode === 'select' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Slide Designs</h3>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Slide
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {designs.map((design) => (
                  <Card key={design.id} className="relative overflow-hidden">
                    <div className="relative">
                      {design.background_image_url ? (
                        <div className="w-full h-48 relative">
                          <img
                            src={design.background_image_url}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {/* Text overlay preview */}
                          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                            {design.design_data?.textElements?.map((element, index) => (
                              <div
                                key={element.id}
                                className="mb-2"
                                style={{
                                  fontSize: index === 0 ? '1rem' : '0.75rem',
                                  fontWeight: index === 0 ? 'bold' : 'normal',
                                  opacity: 0.9
                                }}
                              >
                                {element.text.length > 30 ? `${element.text.substring(0, 30)}...` : element.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-48 flex items-center justify-center"
                          style={{ backgroundColor: design.background_color }}
                        >
                          <div className="text-center text-white">
                            <Image className="h-12 w-12 mx-auto mb-2 opacity-60" />
                            <p className="text-sm opacity-80">No Background Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base truncate">{design.title}</CardTitle>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {design.layout_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {design.description && (
                        <CardDescription className="text-sm line-clamp-2">{design.description}</CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDesign(design)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDesign(design)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {designs.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No slide designs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first custom slide design to get started
                    </p>
                    <Button onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Slide
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {mode === 'edit' && (
            <WYSIWYGEditor
              template={selectedTemplate}
              design={editingDesign}
              onSave={handleSaveDesign}
              onPreview={handlePreview}
            />
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateSelector
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
