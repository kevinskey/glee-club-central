
import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { Icons } from "@/components/Icons";

export function SidebarHelp() {
  return (
    <div className="mt-auto px-6 py-4">
      <div 
        className="flex items-center justify-between rounded-lg border border-dashed p-3"
      >
        <div>
          <p className="text-xs font-semibold">Need Help?</p>
          <p className="text-xs text-muted-foreground">View the Glee Club handbook</p>
        </div>
        <Link 
          to="/dashboard/handbook"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
        >
          <Book className="h-4 w-4" />
          <span className="sr-only">View Handbook</span>
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <Icons.logo className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
