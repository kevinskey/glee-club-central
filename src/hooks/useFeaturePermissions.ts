
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';

export interface FeaturePermission {
  id: string;
  feature_key: string;
  user_id?: string;
  role_tag?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PagePermission {
  id: string;
  page_path: string;
  user_id?: string;
  role_tag?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Define available features and pages
export const AVAILABLE_FEATURES = [
  { key: 'financial_management', label: 'Financial Management', description: 'Access to budget and financial data' },
  { key: 'user_management', label: 'User Management', description: 'Manage members and roles' },
  { key: 'music_library', label: 'Music Library', description: 'Upload and manage sheet music' },
  { key: 'event_management', label: 'Event Management', description: 'Create and manage events' },
  { key: 'announcements', label: 'Announcements', description: 'Post announcements' },
  { key: 'media_upload', label: 'Media Upload', description: 'Upload photos and videos' },
  { key: 'store_management', label: 'Store Management', description: 'Manage merchandise and orders' },
  { key: 'analytics', label: 'Analytics', description: 'View dashboard analytics' },
  { key: 'soundcloud_admin', label: 'SoundCloud Admin', description: 'Manage SoundCloud integrations' },
  { key: 'handbook_editor', label: 'Handbook Editor', description: 'Edit club handbook' }
] as const;

export const AVAILABLE_PAGES = [
  { path: '/admin', label: 'Admin Dashboard', description: 'Main admin dashboard' },
  { path: '/admin/members', label: 'Member Management', description: 'Manage club members' },
  { path: '/admin/user-roles', label: 'User Roles', description: 'Manage user roles and permissions' },
  { path: '/admin/financial', label: 'Financial Dashboard', description: 'Financial management tools' },
  { path: '/admin/calendar', label: 'Calendar Admin', description: 'Manage events and calendar' },
  { path: '/admin/music', label: 'Music Admin', description: 'Manage music library' },
  { path: '/admin/store', label: 'Store Admin', description: 'Manage merchandise store' },
  { path: '/admin/analytics', label: 'Analytics', description: 'View analytics dashboard' },
  { path: '/exec/president', label: 'President Tools', description: 'President-specific tools' },
  { path: '/exec/treasurer', label: 'Treasurer Tools', description: 'Treasurer-specific tools' },
  { path: '/exec/secretary', label: 'Secretary Tools', description: 'Secretary-specific tools' },
  { path: '/exec/historian', label: 'Historian Tools', description: 'Historian-specific tools' }
] as const;

export const useFeaturePermissions = () => {
  const { user, profile } = useAuth();
  const [featurePermissions, setFeaturePermissions] = useState<FeaturePermission[]>([]);
  const [pagePermissions, setPagePermissions] = useState<PagePermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch feature permissions
      const { data: features, error: featuresError } = await supabase
        .from('feature_permissions')
        .select('*')
        .or(`user_id.eq.${user.id},role_tag.in.(${(profile?.role_tags || []).map(tag => `"${tag}"`).join(',')})`);

      if (featuresError) throw featuresError;

      // Fetch page permissions
      const { data: pages, error: pagesError } = await supabase
        .from('page_permissions')
        .select('*')
        .or(`user_id.eq.${user.id},role_tag.in.(${(profile?.role_tags || []).map(tag => `"${tag}"`).join(',')})`);

      if (pagesError) throw pagesError;

      setFeaturePermissions(features || []);
      setPagePermissions(pages || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user, profile?.role_tags]);

  const hasFeaturePermission = (featureKey: string): boolean => {
    // Super admin has all permissions
    if (profile?.is_super_admin || profile?.role === 'admin') {
      return true;
    }

    // Check user-specific permission first (highest priority)
    const userPermission = featurePermissions.find(
      p => p.feature_key === featureKey && p.user_id === user?.id
    );
    if (userPermission) {
      return userPermission.enabled;
    }

    // Check role-based permissions
    const rolePermissions = featurePermissions.filter(
      p => p.feature_key === featureKey && p.role_tag && (profile?.role_tags || []).includes(p.role_tag)
    );
    
    // If any role grants permission, allow it
    if (rolePermissions.some(p => p.enabled)) {
      return true;
    }

    // Fall back to legacy permission checker
    const currentUser = {
      ...user,
      role: profile?.role,
      role_tags: profile?.role_tags || []
    };

    // Map feature keys to legacy permissions
    const legacyPermissionMap: Record<string, string> = {
      'financial_management': 'edit_budget',
      'user_management': 'manage_members',
      'music_library': 'upload_docs',
      'event_management': 'edit_events',
      'announcements': 'send_announcement',
      'media_upload': 'upload_media',
      'store_management': 'manage_shop'
    };

    const legacyPermission = legacyPermissionMap[featureKey];
    if (legacyPermission) {
      return hasPermission(currentUser, legacyPermission);
    }

    return false;
  };

  const hasPagePermission = (pagePath: string): boolean => {
    // Super admin has all permissions
    if (profile?.is_super_admin || profile?.role === 'admin') {
      return true;
    }

    // Check user-specific permission first (highest priority)
    const userPermission = pagePermissions.find(
      p => p.page_path === pagePath && p.user_id === user?.id
    );
    if (userPermission) {
      return userPermission.enabled;
    }

    // Check role-based permissions
    const rolePermissions = pagePermissions.filter(
      p => p.page_path === pagePath && p.role_tag && (profile?.role_tags || []).includes(p.role_tag)
    );
    
    // If any role grants permission, allow it
    return rolePermissions.some(p => p.enabled);
  };

  return {
    featurePermissions,
    pagePermissions,
    hasFeaturePermission,
    hasPagePermission,
    loading,
    refetch: fetchPermissions
  };
};
