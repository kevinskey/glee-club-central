
import React from 'react';
import { RouteObject } from 'react-router-dom';
import MembersPage from '@/pages/MembersPage';

export const memberRoutes: RouteObject[] = [
  {
    path: '/members',
    element: <MembersPage />,
  },
];
