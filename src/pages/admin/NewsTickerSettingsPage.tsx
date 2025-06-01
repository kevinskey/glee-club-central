
import React from 'react';
import { TickerManagement } from '@/components/admin/TickerManagement';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuth } from '@/contexts/AuthContext';

export default function NewsTickerSettingsPage() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader message="Loading ticker settings..." />;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">News Ticker Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure the news ticker that appears on the homepage
        </p>
      </div>
      
      <TickerManagement />
    </div>
  );
}
