
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function DashboardSidebar() {
  const { isAdmin } = useAuth();
  
  // For now, use the AdminSidebar as the base - we can customize this later
  // if we need member-specific sidebar items
  return <AdminSidebar />;
}
