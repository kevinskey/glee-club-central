
import React from "react";
import { cn } from "@/lib/utils";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="inset"
    className={cn(
      "relative flex min-h-svh flex-1 flex-col bg-background",
      "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
      className
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";
