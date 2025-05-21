
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Info } from "lucide-react";

export function AboutGleeToolsItem() {
  return (
    <DropdownMenuItem
      onClick={() => toast.info("Glee Tools v1.1 - Music Practice Suite")}
      className="cursor-pointer flex items-center gap-2 text-foreground"
    >
      <Info className="h-4 w-4" />
      About Glee Tools
    </DropdownMenuItem>
  );
}
