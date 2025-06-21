import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HeroSlide } from "@/hooks/useHeroSlides";

interface EditSlideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSlideUpdated: () => void;
  slide: HeroSlide | null;
}

export function EditSlideModal({
  open,
  onOpenChange,
  onSlideUpdated,
  slide,
}: EditSlideModalProps) {
  const { mediaFiles } = useMediaLibrary();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_id: "",
    button_text: "",
    button_link: "",
    text_position: "center",
    text_alignment: "center",
    show_title: true,
    visible: false,
    media_type: "image",
    youtube_url: "",
  });

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || "",
        description: slide.description || "",
        media_id: slide.media_id || "",
        button_text: slide.button_text || "",
        button_link: slide.button_link || "",
        text_position: slide.text_position || "center",
        text_alignment: slide.text_alignment || "center",
        show_title: slide.show_title ?? true,
        visible: slide.visible ?? false,
        media_type: slide.media_type || "image",
        youtube_url: slide.youtube_url || "",
      });
    }
  }, [slide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slide) return;

    setIsSubmitting(true);

    try {
      const slideData = {
        ...formData,
        media_id: formData.media_id || null,
        youtube_url:
          formData.media_type === "video" ? formData.youtube_url || null : null,
      };

      const { error } = await supabase
        .from("hero_slides")
        .update(slideData)
        .eq("id", slide.id);

      if (error) throw error;

      toast.success("Hero slide updated successfully");
      onSlideUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update hero slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageFiles = mediaFiles.filter((file) =>
    file.file_type.startsWith("image/"),
  );

  if (!slide) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hero Slide</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter slide title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter slide description"
              rows={3}
            />
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label>Media Type</Label>
            <Select
              value={formData.media_type}
              onValueChange={(value) =>
                setFormData({ ...formData, media_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">YouTube Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Selection */}
          {formData.media_type === "image" ? (
            <div className="space-y-2">
              <Label>Background Image</Label>
              <Select
                value={formData.media_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, media_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an image" />
                </SelectTrigger>
                <SelectContent>
                  {imageFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          )}

          {/* Text Position */}
          <div className="space-y-2">
            <Label>Text Position</Label>
            <Select
              value={formData.text_position}
              onValueChange={(value) =>
                setFormData({ ...formData, text_position: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <Select
              value={formData.text_alignment}
              onValueChange={(value) =>
                setFormData({ ...formData, text_alignment: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_text">Button Text</Label>
              <Input
                id="button_text"
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                placeholder="Learn More"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button_link">Button Link</Label>
              <Input
                id="button_link"
                value={formData.button_link}
                onChange={(e) =>
                  setFormData({ ...formData, button_link: e.target.value })
                }
                placeholder="/about"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show_title">Show Title</Label>
            <Switch
              id="show_title"
              checked={formData.show_title}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, show_title: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="visible">Visible on Site</Label>
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, visible: checked })
              }
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? "Updating..." : "Update Slide"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
