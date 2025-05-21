
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function AboutGleeToolsItem() {
  return (
    <DropdownMenuItem
      onClick={() => toast.info("Glee Tools v1.1 - Music Practice Suite")}
      className="cursor-pointer"
    >
      About Glee Tools
    </DropdownMenuItem>
  );
}
