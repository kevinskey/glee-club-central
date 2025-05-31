
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  className,
  children 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex justify-between items-center min-h-[3rem]">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary flex items-center">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">{title}</h1>
        </div>
        {children}
      </div>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
