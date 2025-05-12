
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Header } from "@/components/landing/Header";

const HomeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <Toaster />
      {/* Show mobile header on mobile devices and standard header on larger screens */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <Header initialShowNewsFeed={false} />
      )}
      <Outlet />
    </>
  );
};

export default HomeLayout;
