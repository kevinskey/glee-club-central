
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';

// Import public pages
import HomePage from '@/pages/HomePage';
import CalendarPage from '@/pages/CalendarPage';
import EventDetailPage from '@/pages/EventDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/auth/LoginPage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout sidebarType="none" showHeader={true} showFooter={true} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'event/:id', element: <EventDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
];
