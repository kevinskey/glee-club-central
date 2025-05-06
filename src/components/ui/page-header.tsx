
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
    <div className={cn("mb-6 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary flex items-center">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center min-h-[2.25rem]">{title}</h1>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
