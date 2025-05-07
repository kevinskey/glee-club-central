
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon: LucideIcon;
}

export function NavItem({ href, children, icon: Icon }: NavItemProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-secondary"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
