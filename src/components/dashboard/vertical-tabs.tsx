
import React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: VerticalTabsProps) {
  return (
    <div className="space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 rounded-full px-2 py-0.5 text-xs",
              activeTab === tab.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
