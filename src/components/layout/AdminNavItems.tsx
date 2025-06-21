
import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Music, 
  ShoppingBag, 
  BarChart3, 
  MessageSquare, 
  DollarSign, 
  Settings,
  Upload,
  Presentation
} from 'lucide-react';

export const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and analytics'
  },
  {
    title: 'Members',
    href: '/admin/members',
    icon: Users,
    description: 'Manage club members'
  },
  {
    title: 'Calendar',
    href: '/admin/calendar',
    icon: Calendar,
    description: 'Events and scheduling'
  },
  {
    title: 'Hero Slides',
    href: '/admin/hero-slides',
    icon: Presentation,
    description: 'Manage landing page slider'
  },
  {
    title: 'Media Library',
    href: '/admin/media',
    icon: FileText,
    description: 'Photos, videos, and files'
  },
  {
    title: 'Sheet Music',
    href: '/admin/sheet-music',
    icon: Music,
    description: 'Music library management'
  },
  {
    title: 'Store',
    href: '/admin/store',
    icon: ShoppingBag,
    description: 'Products and orders'
  },
  {
    title: 'Communications',
    href: '/admin/communications',
    icon: MessageSquare,
    description: 'Messages and announcements'
  },
  {
    title: 'Finances',
    href: '/admin/finances',
    icon: DollarSign,
    description: 'Budget and transactions'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Reports and insights'
  },
  {
    title: 'Reader Import',
    href: '/admin/reader-import',
    icon: Upload,
    description: 'Import user data'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
];
