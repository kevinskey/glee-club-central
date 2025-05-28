
import React from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { BasicPitchPipeDialog } from "./dialogs/BasicPitchPipeDialog";
import { BasicMetronomeDialog } from "./dialogs/BasicMetronomeDialog";
import { AboutGleeToolsItem } from "./dialogs/AboutGleeToolsItem";

export function GleeToolsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Headphones className="h-5 w-5" />
          <span className="sr-only">Glee Tools</span>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-glee-columbia"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-semibold">Glee Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <BasicPitchPipeDialog />
        <BasicMetronomeDialog />
        
        <DropdownMenuSeparator />
        <AboutGleeToolsItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
