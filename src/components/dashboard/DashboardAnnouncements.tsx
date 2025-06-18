
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  related_event_id?: string;
  created_at: string;
  expires_at?: string;
}

export function DashboardAnnouncements() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      toast.success('Notification dismissed');
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss notification');
    }
  };

  const getPriorityBadge = (type: string, isRead: boolean) => {
    const baseClasses = "text-xs glass-button";
    
    if (isRead) {
      return <Badge variant="outline" className={`${baseClasses} border-white/30`}>Read</Badge>;
    }

    switch(type) {
      case 'error':
        return <Badge variant="destructive" className={baseClasses}>Important</Badge>;
      case 'warning':
        return <Badge variant="secondary" className={baseClasses}>Warning</Badge>;
      case 'success':
        return <Badge className={`${baseClasses} bg-green-500/80 hover:bg-green-600/80`}>Success</Badge>;
      default:
        return <Badge variant="default" className={`${baseClasses} bg-[#0072CE]/80`}>New</Badge>;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Card className="glass-card rounded-2xl border-white/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-subhead font-playfair text-foreground">
            <Bell className="mr-3 h-5 w-5 text-amber-600" />
            Announcements
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs glass-button">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchNotifications} className="glass-button rounded-xl">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0072CE] mx-auto mb-2"></div>
              <p className="text-body">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`glass-card border border-white/20 rounded-xl p-3 glass-hover ${
                  !notification.is_read ? 'bg-[#0072CE]/5 border-[#0072CE]/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <h4 className={`text-body font-medium ${!notification.is_read ? 'text-[#0072CE]' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    {getPriorityBadge(notification.type, notification.is_read)}
                    {notification.related_event_id && (
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-caption text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d')}
                    </span>
                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0 glass-button rounded-lg"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                        className="h-6 w-6 p-0 glass-button rounded-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-body text-muted-foreground">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-10 w-10 mb-2 opacity-30" />
              <p className="text-body">No announcements at this time</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
