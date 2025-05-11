
import React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <div className={cn("mb-6 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-orange-500 flex items-center">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center min-h-[2.25rem]">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {actions && <div>{actions}</div>}
        </div>
      </div>
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
