
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
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary flex items-center">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">{title}</h1>
        </div>
        {actions && <div className="flex items-end">{actions}</div>}
      </div>
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
