
import React from 'react';
import { Route } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import MemberDashboardPage from '@/pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '@/pages/dashboard/FanDashboardPage';
import PracticePage from '@/pages/practice/PracticePage';
import ProfilePage from '@/pages/ProfilePage';
import RecordingsPage from '@/pages/RecordingsPage';
import EnhancedCalendarPage from '@/pages/EnhancedCalendarPage';
import MediaLibraryPage from '@/pages/media-library/MediaLibraryPage';

// Fix the fan dashboard route sidebarType
const memberRoutes = (
  <Route element={<AppLayout sidebarType="member" showHeader={false} showFooter={false} />}>
    {/* Member dashboard route */}
    <Route index element={<MemberDashboardPage />} />
    <Route path="/member-dashboard" element={<MemberDashboardPage />} />

    {/* Fan dashboard route - no sidebar */}
    <Route path="/fan-dashboard" element={<AppLayout sidebarType="none" showHeader={true} showFooter={true} />}>
      {/* Fan dashboard route */}
      <Route index element={<FanDashboardPage />} />
    </Route>

    {/* Practice route */}
    <Route path="/practice" element={<PracticePage />} />

    {/* Profile route */}
    <Route path="/profile" element={<ProfilePage />} />

    {/* Recordings route */}
    <Route path="/recordings" element={<RecordingsPage />} />

    {/* Calendar route */}
    <Route path="/calendar" element={<EnhancedCalendarPage />} />

    {/* Media Library route */}
    <Route path="/media-library" element={<MediaLibraryPage />} />
  </Route>
);

export { memberRoutes };
