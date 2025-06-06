
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Public Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PublicEventsPage from '@/pages/PublicEventsPage';
import EnhancedCalendarPage from '@/pages/EnhancedCalendarPage';
import JoinGleeFamPage from '@/pages/JoinGleeFamPage';
import StorePage from '@/pages/StorePage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import CheckoutCancelledPage from '@/pages/CheckoutCancelledPage';

export const enhancedPublicRoutes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'events', element: <PublicEventsPage /> },
      { path: 'calendar', element: <EnhancedCalendarPage /> },
      { path: 'join-glee-fam', element: <JoinGleeFamPage /> },
      { path: 'store', element: <StorePage /> },
    ],
  },
  // Checkout Routes
  { 
    path: '/checkout-success', 
    element: <CheckoutSuccessPage />
  },
  { 
    path: '/store/success', 
    element: <CheckoutSuccessPage />
  },
  { 
    path: '/store/cancelled', 
    element: <CheckoutCancelledPage />
  },
];
