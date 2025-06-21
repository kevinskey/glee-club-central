
import React from "react";
import { useLocation } from "react-router-dom";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const location = useLocation();

  console.log("🎯 AppContent: Rendering content for", location.pathname);

  return (
    <main className="pt-0">{children}</main>
  );
}
