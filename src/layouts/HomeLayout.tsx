
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
        <div className="min-h-screen flex flex-col bg-background w-full">
          {/* Show mobile header on mobile devices and standard header on larger screens */}
          {isMobile ? (
            <MobileHeader />
          ) : (
            <Header initialShowNewsFeed={false} />
          )}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomeLayout;
