
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import SheetMusicPage from "./pages/sheet-music/SheetMusicPage";
import ViewSheetMusicPage from "./pages/sheet-music/ViewSheetMusicPage";
import PracticePage from "./pages/practice/PracticePage";
import SchedulePage from "./pages/schedule/SchedulePage";
import MediaLibraryPage from "./pages/media-library/MediaLibraryPage";
import AudioManagementPage from "./pages/audio-management/AudioManagementPage";
import SubmitRecordingPage from "./pages/recordings/SubmitRecordingPage";
import HandbookPage from "./pages/handbook/HandbookPage";

// Placeholder pages for other sections
const MerchPage = () => <div className="px-4 py-8">Buy Glee Merch Page - Coming Soon</div>;
const AttendancePage = () => <div className="px-4 py-8">Check Attendance Record Page - Coming Soon</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="sheet-music" element={<SheetMusicPage />} />
              <Route path="sheet-music/:id" element={<ViewSheetMusicPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="recordings" element={<SubmitRecordingPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="handbook" element={<HandbookPage />} />
              <Route path="merch" element={<MerchPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="media-library" element={<MediaLibraryPage />} />
              <Route path="audio-management" element={<AudioManagementPage />} />
            </Route>

            {/* Catch-all redirect to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
