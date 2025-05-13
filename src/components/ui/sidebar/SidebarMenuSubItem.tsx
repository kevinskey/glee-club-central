
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "./useSidebar";

export interface SidebarMenuSubItemProps extends React.ComponentProps<"li"> {
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuSubItemProps
>(({ className, tooltip, children, ...props }, ref) => {
  const { isMobile, state } = useSidebar();
  
  const item = (
    <li 
      ref={ref} 
      className={cn("group/menu-sub-item", className)} 
      {...props}
    >
      {children}
    </li>
  );

  if (!tooltip) {
    return item;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
});

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
