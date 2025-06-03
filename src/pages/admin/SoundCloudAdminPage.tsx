
import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SoundCloudAdmin } from '@/components/admin/SoundCloudAdmin';
import AdminRoute from '@/components/auth/AdminRoute';

export default function SoundCloudAdminPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <SoundCloudAdmin />
      </AdminLayout>
    </AdminRoute>
  );
}
