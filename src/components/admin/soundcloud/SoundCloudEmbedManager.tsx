import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SoundCloudEmbed {
  id: string;
  title: string;
  artist: string;
  url: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export function SoundCloudEmbedManager() {
  const [embeds, setEmbeds] = useState<SoundCloudEmbed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "Spelman College Glee Club",
    url: "",
    description: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    loadEmbeds();
  }, []);

  const loadEmbeds = async () => {
    try {
      const { data, error } = await supabase
        .from("soundcloud_embeds")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setEmbeds(data || []);
    } catch (error) {
      console.error("Error loading embeds:", error);
      toast.error("Failed to load embeds");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast.error("Title and URL are required");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("soundcloud_embeds")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Embed updated successfully");
      } else {
        const { error } = await supabase
          .from("soundcloud_embeds")
          .insert([formData]);

        if (error) throw error;
        toast.success("Embed added successfully");
      }

      setEditingId(null);
      setShowAddForm(false);
      setFormData({
        title: "",
        artist: "Spelman College Glee Club",
        url: "",
        description: "",
        is_active: true,
        display_order: 0,
      });
      loadEmbeds();
    } catch (error) {
      console.error("Error saving embed:", error);
      toast.error("Failed to save embed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this embed?")) return;

    try {
      const { error } = await supabase
        .from("soundcloud_embeds")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Embed deleted successfully");
      loadEmbeds();
    } catch (error) {
      console.error("Error deleting embed:", error);
      toast.error("Failed to delete embed");
    }
  };

  const handleEdit = (embed: SoundCloudEmbed) => {
    setFormData({
      title: embed.title,
      artist: embed.artist,
      url: embed.url,
      description: embed.description,
      is_active: embed.is_active,
      display_order: embed.display_order,
    });
    setEditingId(embed.id);
    setShowAddForm(true);
  };

  const generateEmbedCode = (url: string) => {
    const embedParams = new URLSearchParams({
      url: url,
      color: "#ff5500",
      auto_play: "false",
      hide_related: "true", // Hides related tracks
      show_comments: "false", // Hides comments section
      show_user: "false", // Hides user info
      show_reposts: "false",
      show_teaser: "false", // Removes teaser for next track
      visual: "false", // Uses minimal waveform instead of artwork
      show_artwork: "false", // Hides large artwork
      buying: "false", // Removes buy buttons
      sharing: "false", // Removes share buttons
      download: "false", // Removes download button
    });

    return `https://w.soundcloud.com/player/?${embedParams.toString()}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Homepage SoundCloud Embeds</CardTitle>
            <Button onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Embed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {embeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No embeds configured yet. Add your first SoundCloud embed to get
                started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {embeds.map((embed) => (
                <div key={embed.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{embed.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {embed.artist}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {embed.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={embed.is_active ? "default" : "secondary"}
                        >
                          {embed.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Order: {embed.display_order}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={embed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(embed)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(embed.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {embed.is_active && (
                    <div className="rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={generateEmbedCode(embed.url)}
                        className="w-full border-0"
                        title={`SoundCloud: ${embed.title}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Embed" : "Add New Embed"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Playlist or track title"
                />
              </div>
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) =>
                    setFormData({ ...formData, artist: e.target.value })
                  }
                  placeholder="Artist name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="url">SoundCloud URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://soundcloud.com/artist/track-or-playlist"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the content"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active on homepage</Label>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                {editingId ? "Update" : "Add"} Embed
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    artist: "Spelman College Glee Club",
                    url: "",
                    description: "",
                    is_active: true,
                    display_order: 0,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
