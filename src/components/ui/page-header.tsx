
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  className, 
  actions 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 pb-4 border-b border-border/40", className)}>
      <div className="flex justify-between items-start min-h-[3rem]">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="text-primary flex items-center justify-center mt-1">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
