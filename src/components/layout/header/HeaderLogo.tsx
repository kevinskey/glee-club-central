
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/Icons";

export function HeaderLogo() {
  return (
    <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
      <Icons.logo className="h-6 w-auto" />
      <span className="text-base ml-2 text-foreground">Glee World</span>
    </Link>
  );
}
