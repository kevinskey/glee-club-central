
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { LayoutDashboard } from "lucide-react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage Glee Club administrative tasks"
        icon={<LayoutDashboard className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <p className="text-muted-foreground">Admin dashboard is under construction.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
