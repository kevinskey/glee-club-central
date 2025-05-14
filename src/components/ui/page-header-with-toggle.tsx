
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
    <div className={cn("mb-8 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-glee-spelman flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
              {icon}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center min-h-[2.25rem]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {actions && <div>{actions}</div>}
        </div>
      </div>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}
