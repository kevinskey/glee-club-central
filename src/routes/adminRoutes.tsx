import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';

// Admin Pages - Using the new unified dashboard
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import EventRSVPsPage from '@/pages/admin/EventRSVPsPage';
import AdminStorePage from '@/pages/admin/AdminStorePage';
import OrdersPage from '@/pages/admin/OrdersPage';
import SiteSettingsPage from '@/pages/admin/SiteSettingsPage';
import NewsTickerSettingsPage from '@/pages/admin/NewsTickerSettingsPage';
import NewsItemsPage from '@/pages/admin/NewsItemsPage';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import FanTagManagerPage from '@/pages/admin/FanTagManagerPage';
import SectionManagerPage from '@/pages/admin/SectionManagerPage';
import FinancialRecords from '@/pages/admin/FinancialRecords';
import UserSystemResetPage from '@/pages/admin/UserSystemResetPage';
import TourMerchPage from '@/pages/admin/TourMerchPage';
import SoundCloudAdminPage from '@/pages/admin/SoundCloudAdminPage';
import SliderConsolePage from '@/pages/admin/SliderConsolePage';
import GleePlannerPage from '@/pages/admin/GleePlannerPage';

// New Enhanced Admin Pages
import EnhancedCalendarPage from '@/pages/admin/EnhancedCalendarPage';
import MemberDashboardAdmin from '@/pages/admin/MemberDashboardAdmin';
import SheetMusicLibraryPage from '@/pages/admin/SheetMusicLibraryPage';
import MusicStudioPage from '@/pages/admin/MusicStudioPage';

// Events
import EventsListPage from '@/pages/events/EventsListPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/sheet-music',
    element: (
      <AdminRoute>
        <SheetMusicLibraryPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/calendar-enhanced',
    element: (
      <AdminRoute>
        <EnhancedCalendarPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/members-dashboard',
    element: (
      <AdminRoute>
        <MemberDashboardAdmin />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/music-studio',
    element: (
      <AdminRoute>
        <MusicStudioPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/slider-console',
    element: (
      <AdminRoute>
        <SliderConsolePage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AdminRoute>
        <UserManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <AdminRoute>
        <SettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/calendar',
    element: (
      <AdminRoute>
        <AdminCalendarPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/events',
    element: (
      <AdminRoute>
        <EventsListPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/events/:eventId',
    element: (
      <AdminRoute>
        <EventDetailsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/events/:eventId/tour-merch',
    element: (
      <AdminRoute>
        <TourMerchPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/tour-merch/:eventId',
    element: (
      <AdminRoute>
        <TourMerchPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/event-rsvps',
    element: (
      <AdminRoute>
        <EventRSVPsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/store',
    element: (
      <AdminRoute>
        <AdminStorePage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/orders',
    element: (
      <AdminRoute>
        <OrdersPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/site-settings',
    element: (
      <AdminRoute>
        <SiteSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/news-ticker',
    element: (
      <AdminRoute>
        <NewsTickerSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/news-items',
    element: (
      <AdminRoute>
        <NewsItemsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/site-images',
    element: (
      <AdminRoute>
        <SiteImagesPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/media-library',
    element: (
      <AdminRoute>
        <AdminMediaLibraryPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/soundcloud',
    element: (
      <AdminRoute>
        <SoundCloudAdminPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <AdminRoute>
        <AnalyticsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/fan-tags',
    element: (
      <AdminRoute>
        <FanTagManagerPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/sections',
    element: (
      <AdminRoute>
        <SectionManagerPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/finances',
    element: (
      <AdminRoute>
        <FinancialRecords />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/user-reset',
    element: (
      <AdminRoute>
        <UserSystemResetPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/glee-planner",
    element: <GleePlannerPage />,
  },
];
