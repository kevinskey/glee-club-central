
import React from 'react';
import { useParams } from 'react-router-dom';
import { UnifiedProfileManager } from '@/components/profile/UnifiedProfileManager';

export default function ProfilePage() {
  const { userId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <UnifiedProfileManager 
        targetUserId={userId}
        onProfileUpdate={() => {
          // Could trigger a refresh of any parent data if needed
        }}
      />
    </div>
  );
}
