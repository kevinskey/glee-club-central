
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/Icons";

export function MobileHeaderLogo() {
  return (
    <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
      <Icons.logo className="h-7 w-auto" />
      <span className="text-sm font-medium ml-1 text-foreground">Glee World</span>
    </Link>
  );
}
