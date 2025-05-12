
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Header } from "@/components/landing/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

const HomeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <Toaster />
      <SidebarProvider>
        {/* Show mobile header on mobile devices and standard header on larger screens */}
        {isMobile ? (
          <MobileHeader />
        ) : (
          <Header initialShowNewsFeed={false} />
        )}
        <Outlet />
      </SidebarProvider>
    </>
  );
};

export default HomeLayout;
