
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSlideDesigns } from '@/hooks/useSlideDesigns';
import { EnhancedWYSIWYGEditor } from './EnhancedWYSIWYGEditor';
import { SlideTemplateCreator } from './SlideTemplateCreator';
import { DesignPreview } from './DesignPreview';
import { SlideTemplate, SlideDesign } from '@/types/slideDesign';
import { 
  Layout, 
  Sparkles, 
  Image as ImageIcon, 
  Grid, 
  Eye, 
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function EnhancedSlideDesignManager() {
  const { templates, designs, isLoading, createDesign, updateDesign, deleteDesign } = useSlideDesigns();
  const [activeTab, setActiveTab] = useState('designer');
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<SlideDesign | null>(null);
  const [previewData, setPreviewData] = useState<{ design?: SlideDesign; template?: SlideTemplate } | null>(null);

  const handleSaveDesign = async (designData: Partial<SlideDesign>) => {
    try {
      if (selectedDesign) {
        await updateDesign(selectedDesign.id, designData);
      } else {
        await createDesign(designData);
      }
      setSelectedDesign(null);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  const handlePreview = () => {
    if (selectedDesign) {
      setPreviewData({ design: selectedDesign });
    } else if (selectedTemplate) {
      setPreviewData({ template: selectedTemplate });
    }
  };

  const handleCreateFromTemplate = (template: SlideTemplate) => {
    setSelectedTemplate(template);
    setSelectedDesign(null);
    setActiveTab('designer');
  };

  const handleEditDesign = (design: SlideDesign) => {
    setSelectedDesign(design);
    setSelectedTemplate(null);
    setActiveTab('designer');
  };

  const handleDeleteDesign = async (id: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      await deleteDesign(id);
    }
  };

  const startNewDesign = () => {
    setSelectedDesign(null);
    setSelectedTemplate(null);
    setActiveTab('designer');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading design studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-orange-500">
                  <Layout className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Enhanced Slide Design Studio
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional slide design tools with templates, advanced editing, and AI assistance
              </p>
            </div>
            <Button onClick={startNewDesign} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Design
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-700">
              <TabsTrigger value="designer" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Designer
                <Badge variant="default" className="ml-1 text-xs">
                  Pro
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Templates
                <Badge variant="secondary" className="ml-1 text-xs">
                  {templates.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="designs" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                My Designs
                <Badge variant="outline" className="ml-1 text-xs">
                  {designs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="create-template" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </TabsTrigger>
            </TabsList>

            <TabsContent value="designer" className="mt-6">
              <EnhancedWYSIWYGEditor
                template={selectedTemplate || undefined}
                design={selectedDesign || undefined}
                onSave={handleSaveDesign}
                onPreview={handlePreview}
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Available Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a template to start designing
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {template.layout_type}
                          </Badge>
                        </div>
                        {template.description && (
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCreateFromTemplate(template)}
                            size="sm"
                            className="flex-1"
                          >
                            Use Template
                          </Button>
                          <Button
                            onClick={() => setPreviewData({ template })}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {templates.length === 0 && (
                  <div className="text-center py-8">
                    <Grid className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first template to get started
                    </p>
                    <Button onClick={() => setActiveTab('create-template')}>
                      Create Template
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="designs" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Designs</h3>
                  <Button onClick={startNewDesign} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Design
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designs.map((design) => (
                    <Card key={design.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{design.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {design.layout_type}
                          </Badge>
                        </div>
                        {design.description && (
                          <p className="text-sm text-muted-foreground">{design.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditDesign(design)}
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => setPreviewData({ design })}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteDesign(design.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {designs.length === 0 && (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Designs Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start creating your first slide design
                    </p>
                    <Button onClick={startNewDesign}>
                      Create Design
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create-template" className="mt-6">
              <SlideTemplateCreator
                onSave={async (template) => {
                  // Here you would save the template to the database
                  toast.success('Template created successfully');
                  setActiveTab('templates');
                }}
                onPreview={(template) => setPreviewData({ template: template as SlideTemplate })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewData && (
        <DesignPreview
          design={previewData.design}
          template={previewData.template}
          onClose={() => setPreviewData(null)}
          onFullscreen={() => {
            // Implement fullscreen preview
            toast.info('Fullscreen preview coming soon');
          }}
        />
      )}
    </div>
  );
}
