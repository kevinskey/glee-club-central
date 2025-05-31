
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AdminRegistrationPage from '@/pages/admin/AdminRegistrationPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

export const authRoutes: RouteObject[] = [
  { 
    path: '/login', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><LoginPage /></AppLayout>
  },
  { 
    path: '/signup', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><SignupPage /></AppLayout>
  },
  { 
    path: '/register', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><AdminRegistrationPage /></AppLayout>
  },
  { 
    path: '/forgot-password', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ForgotPasswordPage /></AppLayout>
  },
  { 
    path: '/reset-password', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ResetPasswordPage /></AppLayout>
  },
  { 
    path: '/update-password', 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ResetPasswordPage /></AppLayout>
  },
];
