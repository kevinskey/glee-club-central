
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
    <div className={cn("mb-8 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
