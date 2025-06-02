
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Images } from "lucide-react";
import { ModularHeroManager } from '@/components/admin/ModularHeroManager';

export default function AdminModularHeroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Hero Section Manager"
        description="Manage hero sections for different pages using your media library"
        icon={<Images className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <ModularHeroManager />
      </div>
    </div>
  );
}
