import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "email" | "sms" | "both";
  category: string;
  is_active: boolean;
  created_at: string;
}

export function MessageTemplateManager() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    type: "email" as "email" | "sms" | "both",
    category: "general",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // For now, we'll use a simple array since the table might not exist yet
      // In a real implementation, this would load from the database
      setTemplates([
        {
          id: "1",
          name: "Welcome New Member",
          subject: "Welcome to Spelman Glee Club!",
          content:
            "Dear {{first_name}},\n\nWelcome to the Spelman College Glee Club family! We are excited to have you join us on this musical journey.\n\nBest regards,\nThe Glee Club Team",
          type: "email",
          category: "welcome",
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Rehearsal Reminder",
          subject: "Rehearsal Reminder - {{date}}",
          content:
            "Hi {{first_name}},\n\nThis is a reminder about our rehearsal today at {{time}}. Please bring your music and arrive on time.\n\nSee you there!",
          type: "both",
          category: "reminder",
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Performance Announcement",
          subject: "Upcoming Performance - {{event_name}}",
          content:
            "Dear Glee Club Members,\n\nWe have an exciting performance coming up!\n\nEvent: {{event_name}}\nDate: {{event_date}}\nLocation: {{event_location}}\n\nPlease mark your calendars and prepare accordingly.\n\nBreak a leg!\nThe Glee Club Team",
          type: "email",
          category: "announcement",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        const updatedTemplates = templates.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                ...formData,
                id: editingTemplate.id,
                created_at: editingTemplate.created_at,
              }
            : t,
        );
        setTemplates(updatedTemplates);
        toast.success("Template updated successfully");
      } else {
        // Create new template
        const newTemplate: MessageTemplate = {
          id: Date.now().toString(),
          ...formData,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        setTemplates([...templates, newTemplate]);
        toast.success("Template created successfully");
      }

      setShowForm(false);
      setEditingTemplate(null);
      setFormData({
        name: "",
        subject: "",
        content: "",
        type: "email",
        category: "general",
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleEdit = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type,
      category: template.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
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
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Message Templates
            </CardTitle>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No message templates found</p>
              <p className="text-sm">
                Create your first template to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          template.type === "email"
                            ? "default"
                            : template.type === "sms"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {template.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded">
                    {template.content.substring(0, 200)}
                    {template.content.length > 200 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Message Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {(formData.type === "email" || formData.type === "both") && (
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter message content... Use {{first_name}}, {{last_name}}, etc. for personalization"
                rows={8}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSave}>
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                  setFormData({
                    name: "",
                    subject: "",
                    content: "",
                    type: "email",
                    category: "general",
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
