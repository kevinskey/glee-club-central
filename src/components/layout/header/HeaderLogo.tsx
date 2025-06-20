
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/Icons";

export function HeaderLogo() {
  return (
    <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
      <Icons.logo className="h-7 w-auto" />
      <span className="text-base ml-2 text-black dark:text-white font-semibold">Glee World</span>
    </Link>
  );
}
