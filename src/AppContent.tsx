import React from "react";
import { useLocation } from "react-router-dom";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const location = useLocation();

  // Pages that manage their own headers completely (including TopSlider)
  const pagesWithOwnHeaders = [
    "/login",
    "/signup",
    "/", // HomePage manages its own header via PublicPageWrapper
    "/contact", // ContactPage manages its own header and footer
    "/about", // AboutPage uses PublicPageWrapper which manages its own header
    "/calendar", // CalendarPage manages its own minimal header
    "/events", // Events page manages its own header
  ];

  // Dashboard pages that should not show the unified header (they manage their own)
  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/role-dashboard");

  // Admin pages should NOT show any unified header as they use AdminLayout
  const isAdminPage = location.pathname.startsWith("/admin");

  const shouldShowHeader =
    !pagesWithOwnHeaders.includes(location.pathname) &&
    !isDashboardPage &&
    !isAdminPage;

  console.log("🎯 AppContent: Header decision for", location.pathname, {
    shouldShowHeader,
    isAdminPage,
    isDashboardPage,
    isInPagesWithOwnHeaders: pagesWithOwnHeaders.includes(location.pathname),
  });

  return (
    <>
      {shouldShowHeader && <UnifiedPublicHeader />}
      <main className={shouldShowHeader ? "" : "pt-0"}>{children}</main>
    </>
  );
}
