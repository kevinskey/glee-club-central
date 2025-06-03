
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
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm">Loading slide design system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Slide Design Manager</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage custom slides for your homepage hero section
          </p>
        </div>
        {mode !== 'select' && (
          <Button onClick={() => setMode('select')} variant="outline" size="sm">
            Back to Overview
          </Button>
        )}
      </div>

      <Tabs defaultValue="designs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="designs" className="text-sm">Active Designs</TabsTrigger>
          <TabsTrigger value="templates" className="text-sm">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-3">
          {mode === 'select' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Your Slide Designs</h3>
                <Button onClick={handleCreateNew} size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Create New Slide
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {designs.map((design) => (
                  <Card key={design.id} className="relative overflow-hidden h-fit">
                    <div className="relative">
                      {design.background_image_url ? (
                        <div className="w-full h-32 relative">
                          <img
                            src={design.background_image_url}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {/* Text overlay preview */}
                          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-2">
                            {design.design_data?.textElements?.slice(0, 2).map((element, index) => (
                              <div
                                key={element.id}
                                className="mb-1"
                                style={{
                                  fontSize: index === 0 ? '0.7rem' : '0.6rem',
                                  fontWeight: index === 0 ? 'bold' : 'normal',
                                  opacity: 0.9
                                }}
                              >
                                {element.text.length > 20 ? `${element.text.substring(0, 20)}...` : element.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-32 flex items-center justify-center"
                          style={{ backgroundColor: design.background_color }}
                        >
                          <div className="text-center text-white">
                            <Image className="h-8 w-8 mx-auto mb-1 opacity-60" />
                            <p className="text-xs opacity-80">No Background</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm truncate leading-tight">{design.title}</CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0 px-1 py-0">
                          {design.layout_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {design.description && (
                        <CardDescription className="text-xs line-clamp-1">{design.description}</CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-3 pt-0">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDesign(design)}
                          className="flex-1 h-7 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDesign(design)}
                          className="text-red-600 hover:text-red-700 h-7"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {designs.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Layout className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-base font-medium mb-2">No slide designs yet</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create your first custom slide design to get started
                    </p>
                    <Button onClick={handleCreateNew} size="sm">
                      <Plus className="h-3 w-3 mr-1" />
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

        <TabsContent value="templates" className="space-y-3">
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
