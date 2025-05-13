
import React from "react";
import { HeroImagesManager } from "@/components/admin/HeroImagesManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const LandingPageSettingsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Landing Page Settings" 
        description="Manage content and appearance of the landing page"
      />
      
      <div className="grid gap-6">
        <HeroImagesManager />
        
        {/* More landing page settings can be added here in the future */}
      </div>
    </div>
  );
};

export default LandingPageSettingsPage;
