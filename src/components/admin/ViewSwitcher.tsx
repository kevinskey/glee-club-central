
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

type ViewMode = 'admin' | 'member' | 'public';

export function ViewSwitcher() {
  const [viewMode, setViewMode] = useState<ViewMode>('admin');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { isAdmin } = useAuth();

  // Only show for admin users
  if (!isAdmin()) {
    return null;
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setIsPreviewMode(mode !== 'admin');
    
    // Store in localStorage so other components can check
    localStorage.setItem('dev_view_mode', mode);
    localStorage.setItem('dev_preview_active', mode !== 'admin' ? 'true' : 'false');
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'dev_view_mode',
      newValue: mode
    }));
  };

  const togglePreview = () => {
    if (isPreviewMode) {
      handleViewModeChange('admin');
    } else {
      handleViewModeChange('member');
    }
  };

  const getViewModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case 'admin': return 'Admin View';
      case 'member': return 'Member View';
      case 'public': return 'Public View';
    }
  };

  const getViewModeColor = (mode: ViewMode) => {
    switch (mode) {
      case 'admin': return 'bg-red-500';
      case 'member': return 'bg-blue-500';
      case 'public': return 'bg-green-500';
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preview Mode
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePreview}
          className="h-8 w-8 p-0"
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      
      {isPreviewMode && (
        <div className="space-y-2">
          <Select value={viewMode} onValueChange={(value: ViewMode) => handleViewModeChange(value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member View</SelectItem>
              <SelectItem value="public">Public View</SelectItem>
              <SelectItem value="admin">Admin View</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge 
            className={`${getViewModeColor(viewMode)} text-white text-xs w-full justify-center`}
          >
            {getViewModeLabel(viewMode)}
          </Badge>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Viewing site as {viewMode === 'public' ? 'a visitor' : `a ${viewMode}`}
          </p>
        </div>
      )}
    </div>
  );
}
