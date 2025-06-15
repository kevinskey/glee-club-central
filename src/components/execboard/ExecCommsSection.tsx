import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, Send, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  target_audience: any;
  delivery_methods: string[];
}

export function ExecCommsSection() {
  const { profile } = useAuth() as { profile: Profile | null };
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all',
    delivery_methods: ['app']
  });

  const targetAudiences = [
    { value: 'all', label: 'All Members' },
    { value: 'exec_board', label: 'Executive Board Only' },
    { value: 'voice_parts', label: 'Specific Voice Parts' }
  ];

  const deliveryMethods = [
    { value: 'app', label: 'In-App Notification' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' }
  ];

  const canSendAnnouncements = () => {
    return ['President', 'Secretary', 'Social Media Chair'].includes(profile?.exec_board_role || '');
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          created_at,
          target_audience,
          delivery_methods,
          created_by,
          profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedAnnouncements = (data ?? []).map(announcement => {
        let created_by = "Unknown";
        if (Array.isArray(announcement.profiles)) {
          if (announcement.profiles.length > 0) {
            created_by = `${announcement.profiles[0]?.first_name ?? ""} ${announcement.profiles[0]?.last_name ?? ""}`.trim() || "Unknown";
          }
        } else if (announcement.profiles?.first_name || announcement.profiles?.last_name) {
          created_by = `${announcement.profiles.first_name ?? ""} ${announcement.profiles.last_name ?? ""}`.trim() || "Unknown";
        }
        return {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          created_at: announcement.created_at,
          created_by,
          target_audience: announcement.target_audience,
          delivery_methods: announcement.delivery_methods || [],
        };
      });

      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please provide both title and content');
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: formData.title,
          content: formData.content,
          created_by: profile?.id,
          target_audience: { type: formData.target_audience },
          delivery_methods: formData.delivery_methods
        });

      if (error) throw error;

      toast.success('Announcement sent successfully');
      setAnnouncementDialog(false);
      setFormData({ title: '', content: '', target_audience: 'all', delivery_methods: ['app'] });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error sending announcement:', error);
      toast.error('Failed to send announcement');
    }
  };

  const toggleDeliveryMethod = (method: string) => {
    const newMethods = formData.delivery_methods.includes(method)
      ? formData.delivery_methods.filter(m => m !== method)
      : [...formData.delivery_methods, method];
    setFormData({ ...formData, delivery_methods: newMethods });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Communications
        </CardTitle>
        {canSendAnnouncements() && (
          <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Your announcement message..."
                    rows={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery Methods</label>
                  <div className="flex gap-2 mt-2">
                    {deliveryMethods.map(method => (
                      <Button
                        key={method.value}
                        variant={formData.delivery_methods.includes(method.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDeliveryMethod(method.value)}
                      >
                        {method.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSendAnnouncement} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No announcements yet</p>
            {canSendAnnouncements() && (
              <p className="text-sm">Click "Send Announcement" to communicate with members</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <div className="flex gap-1">
                    {announcement.delivery_methods.map(method => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>By {announcement.created_by}</span>
                  <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
