
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  user: string;
  avatar: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async (): Promise<RecentActivity[]> => {
      const activities: RecentActivity[] = [];

      // Fetch recent events
      const { data: events } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_created_by_fkey(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (events) {
        events.forEach(event => {
          const creator = event.profiles;
          activities.push({
            id: `event-${event.id}`,
            type: 'event',
            title: 'New event scheduled',
            description: `"${event.title}" scheduled for ${new Date(event.start_time).toLocaleDateString()}`,
            user: creator ? `${creator.first_name} ${creator.last_name}` : 'Unknown',
            avatar: creator?.avatar_url || '',
            time: formatTimeAgo(event.created_at),
            icon: 'Calendar',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
          });
        });
      }

      // Fetch recent media uploads
      const { data: media } = await supabase
        .from('media_library')
        .select(`
          *,
          profiles!media_library_uploaded_by_fkey(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (media) {
        media.forEach(item => {
          const uploader = item.profiles;
          activities.push({
            id: `media-${item.id}`,
            type: 'upload',
            title: 'Media files uploaded',
            description: `"${item.title}" added to library`,
            user: uploader ? `${uploader.first_name} ${uploader.last_name}` : 'Unknown',
            avatar: uploader?.avatar_url || '',
            time: formatTimeAgo(item.created_at),
            icon: 'Upload',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
          });
        });
      }

      // Fetch recent profile updates
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (profiles) {
        profiles.forEach(profile => {
          // Only show if updated recently (not just created)
          if (profile.updated_at !== profile.created_at) {
            activities.push({
              id: `profile-${profile.id}`,
              type: 'member',
              title: 'Member profile updated',
              description: `${profile.first_name} ${profile.last_name} updated their profile`,
              user: `${profile.first_name} ${profile.last_name}`,
              avatar: profile.avatar_url || '',
              time: formatTimeAgo(profile.updated_at),
              icon: 'UserPlus',
              color: 'text-purple-600 dark:text-purple-400',
              bgColor: 'bg-purple-100 dark:bg-purple-900/20'
            });
          }
        });
      }

      // Sort all activities by time and return top 6
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 6);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}
