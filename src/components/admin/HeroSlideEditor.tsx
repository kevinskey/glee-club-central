
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Edit, Eye, Save, X, Plus, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  position: number;
}

interface HeroSlideEditorProps {
  slide: HeroSlide;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export function HeroSlideEditor({ slide, onUpdate, onDelete }: HeroSlideEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    button_text: slide.button_text || "",
    button_link: slide.button_link || "",
    secondary_button_text: slide.secondary_button_text || "",
    secondary_button_link: slide.secondary_button_link || ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('hero_slides')
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          button_text: formData.button_text,
          button_link: formData.button_link,
          secondary_button_text: formData.secondary_button_text || null,
          secondary_button_link: formData.secondary_button_link || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', slide.id);

      if (error) throw error;
      
      toast.success("Slide updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slide.id);

      if (error) throw error;
      
      toast.success("Slide deleted successfully");
      onDelete(slide.id);
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Slide {slide.position + 1}</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Hero Slide</DialogTitle>
                  <DialogDescription>
                    Customize the text, buttons, and links for this slide
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter slide title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Textarea
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        placeholder="Enter slide subtitle"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Primary Button</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="button_text">Button Text</Label>
                        <Input
                          id="button_text"
                          value={formData.button_text}
                          onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                          placeholder="Button text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="button_link">Button Link</Label>
                        <Input
                          id="button_link"
                          value={formData.button_link}
                          onChange={(e) => setFormData({...formData, button_link: e.target.value})}
                          placeholder="/path or https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Secondary Button (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="secondary_button_text">Button Text</Label>
                        <Input
                          id="secondary_button_text"
                          value={formData.secondary_button_text}
                          onChange={(e) => setFormData({...formData, secondary_button_text: e.target.value})}
                          placeholder="Secondary button text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondary_button_link">Button Link</Label>
                        <Input
                          id="secondary_button_link"
                          value={formData.secondary_button_link}
                          onChange={(e) => setFormData({...formData, secondary_button_link: e.target.value})}
                          placeholder="/path or https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <AspectRatio ratio={16/9} className="overflow-hidden rounded-lg">
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Hero+Image";
              }}
            />
          </AspectRatio>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{slide.title || "Untitled Slide"}</h3>
            <p className="text-muted-foreground text-sm">{slide.subtitle || "No subtitle"}</p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {slide.button_text && (
                <div className="flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded">
                  <LinkIcon className="h-3 w-3" />
                  {slide.button_text} → {slide.button_link || "No link"}
                </div>
              )}
              {slide.secondary_button_text && (
                <div className="flex items-center gap-1 text-xs bg-secondary/10 px-2 py-1 rounded">
                  <LinkIcon className="h-3 w-3" />
                  {slide.secondary_button_text} → {slide.secondary_button_link || "No link"}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
