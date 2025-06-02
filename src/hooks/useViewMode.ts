
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type ViewMode = 'admin' | 'member' | 'public';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>('admin');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only allow preview mode for admins
    if (!isAdmin()) {
      setViewMode('admin');
      setIsPreviewMode(false);
      return;
    }

    // Check localStorage for saved view mode
    const savedViewMode = localStorage.getItem('dev_view_mode') as ViewMode;
    const savedPreviewActive = localStorage.getItem('dev_preview_active') === 'true';
    
    if (savedViewMode && savedPreviewActive) {
      setViewMode(savedViewMode);
      setIsPreviewMode(true);
    }

    // Listen for changes from the ViewSwitcher
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dev_view_mode' && e.newValue) {
        const newMode = e.newValue as ViewMode;
        setViewMode(newMode);
        setIsPreviewMode(newMode !== 'admin');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAdmin]);

  // Override auth state based on view mode
  const getEffectiveAuthState = () => {
    if (!isPreviewMode || !isAdmin()) {
      return {
        isAuthenticated,
        isAdmin: isAdmin(),
        isMember: true,
        viewMode: 'admin' as ViewMode
      };
    }

    switch (viewMode) {
      case 'public':
        return {
          isAuthenticated: false,
          isAdmin: () => false,
          isMember: false,
          viewMode
        };
      case 'member':
        return {
          isAuthenticated: true,
          isAdmin: () => false,
          isMember: true,
          viewMode
        };
      default:
        return {
          isAuthenticated,
          isAdmin: isAdmin(),
          isMember: true,
          viewMode
        };
    }
  };

  return {
    viewMode,
    isPreviewMode,
    ...getEffectiveAuthState()
  };
}
