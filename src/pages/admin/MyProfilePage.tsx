
import React from 'react';
import { UnifiedProfileManager } from '@/components/profile/UnifiedProfileManager';

export default function MyProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UnifiedProfileManager viewMode="view" />
    </div>
  );
}
