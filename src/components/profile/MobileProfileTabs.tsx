
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Activity, Music, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const MobileProfileTabs: React.FC<MobileProfileTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'participation', label: 'Activity', icon: Activity },
    { id: 'music', label: 'Music', icon: Music },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile Bottom Navigation Style */}
      <div className="block sm:hidden">
        <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border-t">
          <CardContent className="p-2">
            <div className="grid grid-cols-3 gap-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "flex flex-col gap-1 h-auto py-2 px-2",
                      activeTab === tab.id && "bg-primary text-primary-foreground"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Spacer for fixed bottom nav */}
        <div className="h-20" />
      </div>

      {/* Desktop Horizontal Tabs */}
      <div className="hidden sm:block">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex-1 flex items-center gap-2",
                  activeTab === tab.id && "bg-background shadow-sm"
                )}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-24 sm:pb-0">
        {children}
      </div>
    </div>
  );
};
