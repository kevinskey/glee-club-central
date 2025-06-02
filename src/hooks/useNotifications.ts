
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();

  // Mock notification data for now
  const notifications = [
    {
      id: '1',
      title: 'Welcome to GleeWorld',
      message: 'Your dashboard is ready to use',
      type: 'info' as const,
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead: (id: string) => {
      // Implementation for marking notifications as read
      console.log('Marking notification as read:', id);
    },
    markAllAsRead: () => {
      // Implementation for marking all notifications as read
      console.log('Marking all notifications as read');
    },
  };
};
