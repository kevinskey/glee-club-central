
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSlideDesigns } from '@/hooks/useSlideDesigns';
import { TemplateSelector } from './TemplateSelector';
import { WYSIWYGEditor } from './WYSIWYGEditor';
import { SlideTemplate, SlideDesign } from '@/types/slideDesign';
import { Layout, Plus, Edit, Eye, Trash2, Loader2, Image, ArrowLeft, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-glee-spelman mx-auto" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Loading slide design system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman/10 to-orange-500/10 rounded-2xl blur-xl"></div>
          <Card className="relative border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-glee-spelman to-orange-500">
                      <Layout className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-glee-spelman to-orange-500 bg-clip-text text-transparent">
                        Slide Design Studio
                      </CardTitle>
                      <CardDescription className="text-base">
                        Create stunning custom slides for your homepage hero section
                      </CardDescription>
                    </div>
                  </div>
                </div>
                {mode !== 'select' && (
                  <Button 
                    onClick={() => setMode('select')} 
                    variant="outline" 
                    className="shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="designs" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-auto grid-cols-2 bg-slate-100 dark:bg-slate-700">
                  <TabsTrigger value="designs" className="px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                    <Layout className="h-4 w-4 mr-2" />
                    Active Designs
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Templates
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="designs" className="space-y-6 mt-0">
                {mode === 'select' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Slide Designs</h3>
                        <p className="text-sm text-muted-foreground">Manage and customize your homepage slides</p>
                      </div>
                      <Button 
                        onClick={handleCreateNew} 
                        className="bg-gradient-to-r from-glee-spelman to-orange-500 hover:from-glee-spelman/90 hover:to-orange-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Slide
                      </Button>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {designs.map((design) => (
                        <Card key={design.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800">
                          <div className="relative">
                            {design.background_image_url ? (
                              <div className="w-full h-40 relative overflow-hidden">
                                <img
                                  src={design.background_image_url}
                                  alt={design.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Text overlay preview */}
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-3">
                                  {design.design_data?.textElements?.slice(0, 2).map((element, index) => (
                                    <div
                                      key={element.id}
                                      className="mb-2 max-w-full px-2"
                                      style={{
                                        fontSize: index === 0 ? '0.8rem' : '0.7rem',
                                        fontWeight: index === 0 ? 'bold' : 'normal',
                                        opacity: 0.9
                                      }}
                                    >
                                      {element.text.length > 25 ? `${element.text.substring(0, 25)}...` : element.text}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="w-full h-40 flex items-center justify-center transition-all duration-300"
                                style={{ backgroundColor: design.background_color }}
                              >
                                <div className="text-center text-white">
                                  <Image className="h-10 w-10 mx-auto mb-2 opacity-60" />
                                  <p className="text-xs opacity-80 font-medium">No Background Image</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditDesign(design)}
                                className="bg-white/90 text-slate-900 hover:bg-white"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteDesign(design)}
                                className="bg-red-500/90 hover:bg-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm font-semibold truncate leading-tight text-slate-900 dark:text-slate-100">
                                {design.title}
                              </CardTitle>
                              <Badge variant="secondary" className="text-xs shrink-0 px-2 py-1 bg-slate-100 dark:bg-slate-700">
                                {design.layout_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            {design.description && (
                              <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                                {design.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}

                      {designs.length === 0 && (
                        <div className="col-span-full">
                          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                            <CardContent className="text-center py-12">
                              <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-glee-spelman/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                  <Layout className="h-8 w-8 text-glee-spelman" />
                                </div>
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No slide designs yet</h3>
                                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    Create your first custom slide design to showcase your content beautifully on the homepage
                                  </p>
                                </div>
                                <Button 
                                  onClick={handleCreateNew} 
                                  className="bg-gradient-to-r from-glee-spelman to-orange-500 hover:from-glee-spelman/90 hover:to-orange-500/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create Your First Slide
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {mode === 'edit' && (
                  <div className="space-y-6">
                    <WYSIWYGEditor
                      template={selectedTemplate}
                      design={editingDesign}
                      onSave={handleSaveDesign}
                      onPreview={handlePreview}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Design Templates</h3>
                    <p className="text-sm text-muted-foreground">Choose from pre-designed templates to get started quickly</p>
                  </div>
                  
                  <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                  
                  <TemplateSelector
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={handleSelectTemplate}
                    onCreateNew={handleCreateNew}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
