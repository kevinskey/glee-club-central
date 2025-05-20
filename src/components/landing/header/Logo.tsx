
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";
import { Icons } from "@/components/Icons";

export function Logo() {
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <Icons.logo className={isSmallMobile ? "h-6" : isMobile ? "h-7" : "h-12"} />
      <span className={`font-semibold ${
        isSmallMobile ? "text-lg" : 
        isMobile ? "text-xl" : 
        "text-4xl"
      }`}>
        GleeWorld
      </span>
    </Link>
  );
}
