
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icons } from "@/components/Icons";

export function Logo() {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <Icons.logo className={isMobile ? "h-7" : "h-10"} />
      <span className={`font-semibold ${isMobile ? "text-xl" : "text-3xl"}`}>
        GleeWorld
      </span>
    </Link>
  );
}
