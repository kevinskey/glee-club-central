
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMembersPage from "@/pages/admin/MembersPage";
import AdminCalendarPage from "@/pages/admin/AdminCalendarPage";
import AdminMediaLibraryPage from "@/pages/admin/AdminMediaLibraryPage";
import AdminStorePage from "@/pages/admin/AdminStorePage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";
import CommunicationsPage from "@/pages/admin/CommunicationsPage";
import FinancialPage from "@/pages/admin/FinancialPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import SheetMusicLibraryPage from "@/pages/admin/SheetMusicLibraryPage";
import ReaderImportPage from "@/pages/admin/ReaderImportPage";
import HeroSlidesPage from "@/pages/admin/HeroSlidesPage";

export const AdminRoutes = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="members" element={<AdminMembersPage />} />
        <Route path="calendar" element={<AdminCalendarPage />} />
        <Route path="media" element={<AdminMediaLibraryPage />} />
        <Route path="store" element={<AdminStorePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="communications" element={<CommunicationsPage />} />
        <Route path="finances" element={<FinancialPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="sheet-music" element={<SheetMusicLibraryPage />} />
        <Route path="reader-import" element={<ReaderImportPage />} />
        <Route path="hero-slides" element={<HeroSlidesPage />} />
      </Routes>
    </div>
  );
};
