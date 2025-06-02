
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import EventRSVPsPage from '@/pages/admin/EventRSVPsPage';
import AdminStorePage from '@/pages/admin/AdminStorePage';
import OrdersPage from '@/pages/admin/OrdersPage';
import SiteSettingsPage from '@/pages/admin/SiteSettingsPage';
import LandingPageSettingsPage from '@/pages/admin/LandingPageSettingsPage';
import NewsTickerSettingsPage from '@/pages/admin/NewsTickerSettingsPage';
import NewsItemsPage from '@/pages/admin/NewsItemsPage';
import AdminHeroManager from '@/pages/admin/AdminHeroManager';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import FanTagManagerPage from '@/pages/admin/FanTagManagerPage';
import SectionManagerPage from '@/pages/admin/SectionManagerPage';
import FinancialRecords from '@/pages/admin/FinancialRecords';
import UserSystemResetPage from '@/pages/admin/UserSystemResetPage';
import TourMerchPage from '@/pages/admin/TourMerchPage';

// Events
import EventsListPage from '@/pages/events/EventsListPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/home',
    element: (
      <AdminRoute>
        <AdminDashboardPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/users',
    element: (
      <AdminRoute>
        <UserManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/settings',
    element: (
      <AdminRoute>
        <SettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/calendar',
    element: (
      <AdminRoute>
        <AdminCalendarPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/events',
    element: (
      <AdminRoute>
        <EventsListPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/events/:eventId',
    element: (
      <AdminRoute>
        <EventDetailsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/events/:eventId/tour-merch',
    element: (
      <AdminRoute>
        <TourMerchPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/tour-merch/:eventId',
    element: (
      <AdminRoute>
        <TourMerchPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/event-rsvps',
    element: (
      <AdminRoute>
        <EventRSVPsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/store',
    element: (
      <AdminRoute>
        <AdminStorePage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/orders',
    element: (
      <AdminRoute>
        <OrdersPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/site-settings',
    element: (
      <AdminRoute>
        <SiteSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/landing-settings',
    element: (
      <AdminRoute>
        <LandingPageSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/news-ticker',
    element: (
      <AdminRoute>
        <NewsTickerSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/news-items',
    element: (
      <AdminRoute>
        <NewsItemsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/hero-manager',
    element: (
      <AdminRoute>
        <AdminHeroManager />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/site-images',
    element: (
      <AdminRoute>
        <SiteImagesPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/media-library',
    element: (
      <AdminRoute>
        <AdminMediaLibraryPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/analytics',
    element: (
      <AdminRoute>
        <AnalyticsPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/fan-tags',
    element: (
      <AdminRoute>
        <FanTagManagerPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/sections',
    element: (
      <AdminRoute>
        <SectionManagerPage />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/finances',
    element: (
      <AdminRoute>
        <FinancialRecords />
      </AdminRoute>
    ),
  },
  {
    path: 'dashboard/user-reset',
    element: (
      <AdminRoute>
        <UserSystemResetPage />
      </AdminRoute>
    ),
  },
];
