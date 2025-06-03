
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExecutiveModuleCard } from '@/components/dashboard/ExecutiveModuleCard';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { MobileCardGrid } from '@/components/mobile/MobileCardGrid';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Camera, 
  Heart, 
  FileText, 
  Star, 
  BookOpen,
  Megaphone,
  Calendar,
  Crown,
  Shield
} from 'lucide-react';

interface ModuleConfig {
  title: string;
  description: string;
  to: string;
  icon: typeof DollarSign;
  requiredTags: string[];
}

const moduleConfigs: ModuleConfig[] = [
  {
    title: 'Budget Manager',
    description: 'Track expenses, manage budgets, and oversee financial planning for the Glee Club.',
    to: '/exec/treasurer',
    icon: DollarSign,
    requiredTags: ['Treasurer']
  },
  {
    title: 'Dues Tracker',
    description: 'Monitor member dues payments and send payment reminders.',
    to: '/exec/dues',
    icon: DollarSign,
    requiredTags: ['Treasurer']
  },
  {
    title: 'Photo Gallery Manager',
    description: 'Upload and organize photos from performances, rehearsals, and events.',
    to: '/exec/historian',
    icon: Camera,
    requiredTags: ['Historian']
  },
  {
    title: 'Scrapbook Builder',
    description: 'Create digital scrapbooks and memory collections for the Glee Club.',
    to: '/exec/scrapbook',
    icon: BookOpen,
    requiredTags: ['Historian']
  },
  {
    title: 'Prayer Inbox',
    description: 'Manage prayer requests and spiritual support for members.',
    to: '/exec/prayers',
    icon: Heart,
    requiredTags: ['Chaplain']
  },
  {
    title: 'Devotion Scheduler',
    description: 'Schedule and organize devotional moments for rehearsals and events.',
    to: '/exec/devotions',
    icon: Calendar,
    requiredTags: ['Chaplain']
  },
  {
    title: 'Meeting Notes',
    description: 'Record and manage executive board meeting minutes and notes.',
    to: '/exec/secretary',
    icon: FileText,
    requiredTags: ['Secretary']
  },
  {
    title: 'Social Events Planner',
    description: 'Organize social events, team building activities, and member gatherings.',
    to: '/exec/social-chair',
    icon: Star,
    requiredTags: ['Social Chair']
  },
  {
    title: 'Music Library',
    description: 'Manage sheet music collection, organize repertoire, and track music inventory.',
    to: '/exec/librarian',
    icon: BookOpen,
    requiredTags: ['Librarian']
  },
  {
    title: 'Announcements',
    description: 'Create and send important announcements to all members.',
    to: '/admin/announcements',
    icon: Megaphone,
    requiredTags: ['President', 'Secretary']
  },
  {
    title: 'Handbook Editor',
    description: 'Update and maintain the official Glee Club handbook.',
    to: '/admin/handbook',
    icon: BookOpen,
    requiredTags: ['President', 'Secretary']
  },
  {
    title: 'President Tools',
    description: 'Access comprehensive leadership tools and member management features.',
    to: '/exec/president',
    icon: Crown,
    requiredTags: ['President']
  }
];

export default function ExecutiveDashboard() {
  const { user, profile, isAdmin } = useAuth();
  const roleTags = profile?.role_tags || [];
  
  // Filter modules based on user's role tags
  const availableModules = moduleConfigs.filter(module => 
    module.requiredTags.some(tag => roleTags.includes(tag))
  );

  // Check if user has any executive roles
  const hasExecRoles = availableModules.length > 0;

  return (
    <MobileOptimizedContainer className="py-6">
      <PageHeader
        title="Executive Dashboard"
        description="Welcome to your personalized executive tools and management center"
        icon={<Crown className="h-8 w-8 text-glee-spelman" />}
      />
      
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-glee-spelman/10 to-blue-50 dark:from-glee-spelman/5 dark:to-gray-800 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {profile?.first_name || 'Executive Member'}! 👋
        </h2>
        <p className="text-muted-foreground mb-3">
          You currently hold the following executive positions:
        </p>
        <div className="flex flex-wrap gap-2">
          {roleTags.length > 0 ? (
            roleTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-glee-spelman/10 text-glee-spelman">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No executive roles assigned</Badge>
          )}
          {isAdmin() && (
            <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Executive Tools Grid */}
      {hasExecRoles || isAdmin() ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Executive Tools</h3>
            <MobileCardGrid columns={3} gap="md">
              {availableModules.map((module, index) => (
                <ExecutiveModuleCard
                  key={index}
                  title={module.title}
                  description={module.description}
                  to={module.to}
                  icon={module.icon}
                />
              ))}
              
              {/* Admin Override - Show admin tools if user is admin */}
              {isAdmin() && !roleTags.includes('President') && (
                <ExecutiveModuleCard
                  title="Admin Dashboard"
                  description="Access comprehensive administrative tools and system management."
                  to="/admin"
                  icon={Shield}
                />
              )}
            </MobileCardGrid>
          </div>
        </div>
      ) : (
        /* Fallback for users with no executive roles */
        <div className="text-center py-12">
          <MobileCardGrid columns={1} className="max-w-md mx-auto">
            <ExecutiveModuleCard
              title="No Executive Tools Available"
              description="You currently don't have any Executive Board tools assigned. Contact your administrator if you believe this is an error."
              to="#"
              variant="secondary"
            />
          </MobileCardGrid>
        </div>
      )}
    </MobileOptimizedContainer>
  );
}
