
import React from "react";
import { Link } from "react-router-dom";

export function HeaderLogo() {
  return (
    <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
      <img 
        src="/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png"
        alt="Spelman College Glee Club Logo" 
        className="h-7 w-auto" 
      />
      <span className="text-base ml-2 text-black font-semibold">Glee World</span>
    </Link>
  );
}
