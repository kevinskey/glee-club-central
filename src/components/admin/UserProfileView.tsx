
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UnifiedProfileManager } from '@/components/profile/UnifiedProfileManager';

interface UserProfileViewProps {
  user: any;
  onBack: () => void;
  onEdit: () => void;
}

export function UserProfileView({ user, onBack, onEdit }: UserProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      {/* Unified Profile Manager */}
      <UnifiedProfileManager 
        targetUserId={user.id}
        viewMode="view"
        onProfileUpdate={() => {
          // Could trigger refresh or callback
        }}
      />
    </div>
  );
}
