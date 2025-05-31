
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderWithToggleProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeaderWithToggle({ 
  title, 
  description, 
  icon, 
  className, 
  actions 
}: PageHeaderWithToggleProps) {
  return (
    <div className={cn("mb-8 pb-6 border-b border-border/40", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="text-glee-spelman flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mt-1">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
