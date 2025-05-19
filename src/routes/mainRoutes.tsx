
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import PressKitPage from '../pages/PressKitPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import SocialPage from '../pages/SocialPage';
import FanPage from '../pages/FanPage';
import AdministrationPage from '../pages/AdministrationPage';
import NotFoundPage from '../pages/NotFoundPage';

export const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <LandingPage />,
    },
    {
      path: 'about',
      element: <AboutPage />,
    },
    {
      path: 'contact',
      element: <ContactPage />,
    },
    {
      path: 'announcements',
      element: <AnnouncementsPage />,
    },
    {
      path: 'press-kit',
      element: <PressKitPage />,
    },
    {
      path: 'privacy',
      element: <PrivacyPolicyPage />,
    },
    {
      path: 'terms',
      element: <TermsOfServicePage />,
    },
    {
      path: 'social',
      element: <SocialPage />,
    },
    {
      path: 'fan',
      element: <FanPage />,
    },
    {
      path: 'administration',
      element: <AdministrationPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};
