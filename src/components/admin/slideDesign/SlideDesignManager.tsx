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
    // Create a blank template for the editor
    const blankTemplate: SlideTemplate = {
      id: 'blank',
      name: 'Blank Slide',
      description: 'Start with a completely blank canvas',
      layout_type: 'full',
      designable_areas: [{
        id: 'main',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        constraints: {}
      }],
      default_styles: {},
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSelectedTemplate(blankTemplate);
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
        <div className="text-center space-y-3">
          <div className="relative">
            <Loader2 className="h-6 w-6 animate-spin text-glee-spelman mx-auto" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Loading slide design system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman/10 to-orange-500/10 rounded-xl blur-xl"></div>
          <Card className="relative border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-glee-spelman to-orange-500">
                      <Layout className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-glee-spelman to-orange-500 bg-clip-text text-transparent">
                        Slide Design Studio
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Create stunning custom slides for your homepage hero section
                      </CardDescription>
                    </div>
                  </div>
                </div>
                {mode !== 'select' && (
                  <Button 
                    onClick={() => setMode('select')} 
                    variant="outline" 
                    size="sm"
                    className="shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Overview
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <Tabs defaultValue="designs" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-slate-100 dark:bg-slate-700 h-9 sm:h-8">
                  <TabsTrigger value="designs" className="px-3 sm:px-4 py-1.5 sm:py-1 text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                    <Layout className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Active </span>Designs
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="px-3 sm:px-4 py-1.5 sm:py-1 text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Templates
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="designs" className="space-y-4 mt-0">
                {mode === 'select' && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="space-y-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">Your Slide Designs</h3>
                        <p className="text-xs text-muted-foreground">Manage and customize your homepage slides</p>
                      </div>
                      <Button 
                        onClick={handleCreateNew} 
                        size="sm"
                        className="bg-gradient-to-r from-glee-spelman to-orange-500 hover:from-glee-spelman/90 hover:to-orange-500/90 text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="hidden xs:inline">Create New </span>Slide
                      </Button>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                      {designs.map((design) => (
                        <Card key={design.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800">
                          <div className="relative">
                            {design.background_image_url ? (
                              <div className="w-full h-24 sm:h-32 relative overflow-hidden bg-slate-100 dark:bg-slate-700 rounded-t-lg">
                                <img
                                  src={design.background_image_url}
                                  alt={design.title}
                                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Text overlay preview - only show on hover for larger screens */}
                                <div className="hidden sm:flex absolute inset-0 flex-col justify-center items-center text-white text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {design.design_data?.textElements?.slice(0, 2).map((element, index) => (
                                    <div
                                      key={element.id}
                                      className="mb-1 max-w-full px-1"
                                      style={{
                                        fontSize: index === 0 ? '0.7rem' : '0.6rem',
                                        fontWeight: index === 0 ? 'bold' : 'normal',
                                        opacity: 0.9,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                      }}
                                    >
                                      {element.text.length > 20 ? `${element.text.substring(0, 20)}...` : element.text}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="w-full h-24 sm:h-32 flex items-center justify-center transition-all duration-300 rounded-t-lg"
                                style={{ backgroundColor: design.background_color }}
                              >
                                <div className="text-center text-white">
                                  <Image className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 opacity-60" />
                                  <p className="text-xs opacity-80 font-medium">No Background Image</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Overlay on hover - desktop only */}
                            <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center space-x-1">
                              <Button
                                size="sm"
                                onClick={() => handleEditDesign(design)}
                                className="bg-white/90 text-slate-900 hover:bg-white h-7 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteDesign(design)}
                                className="bg-red-500/90 hover:bg-red-500 h-7 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardHeader className="p-2 sm:p-3 pb-2">
                            <div className="flex items-start justify-between gap-1">
                              <CardTitle className="text-xs font-semibold truncate leading-tight text-slate-900 dark:text-slate-100">
                                {design.title}
                              </CardTitle>
                              <Badge variant="secondary" className="text-xs shrink-0 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700">
                                {design.layout_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            {design.description && (
                              <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                                {design.description}
                              </CardDescription>
                            )}
                            
                            {/* Mobile action buttons */}
                            <div className="flex sm:hidden gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditDesign(design)}
                                className="bg-glee-spelman text-white h-8 flex-1 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteDesign(design)}
                                className="h-8 px-3"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}

                      {designs.length === 0 && (
                        <div className="col-span-full">
                          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                            <CardContent className="text-center py-6 sm:py-8">
                              <div className="space-y-3">
                                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-glee-spelman/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                  <Layout className="h-5 w-5 sm:h-6 sm:w-6 text-glee-spelman" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">No slide designs yet</h3>
                                  <p className="text-xs max-w-md mx-auto text-muted-foreground">
                                    Create your first custom slide design to showcase your content beautifully on the homepage
                                  </p>
                                </div>
                                <Button 
                                  onClick={handleCreateNew} 
                                  size="sm"
                                  className="bg-gradient-to-r from-glee-spelman to-orange-500 hover:from-glee-spelman/90 hover:to-orange-500/90 text-white"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
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
                  <div className="space-y-4">
                    <WYSIWYGEditor
                      template={selectedTemplate}
                      design={editingDesign}
                      onSave={handleSaveDesign}
                      onPreview={handlePreview}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-4 mt-0">
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">Design Templates</h3>
                    <p className="text-xs text-muted-foreground">Choose from pre-designed templates to get started quickly</p>
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
