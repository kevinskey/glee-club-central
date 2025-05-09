import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PermissionRoute } from './components/auth/PermissionRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import CalendarPage from './pages/CalendarPage';
import SheetMusicPage from './pages/sheet-music/SheetMusicPage';
import ChoralTitlesPage from './pages/sheet-music/ChoralTitlesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RecordingsPage from './pages/RecordingsPage';
import LandingPage from './pages/LandingPage';
import FanPage from './pages/FanPage';
import AttendancePage from './pages/AttendancePage';
import PerformanceChecklistPage from './pages/PerformanceChecklistPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdministrationPage from './pages/AdministrationPage';
import ViewSheetMusicPage from './pages/sheet-music/ViewSheetMusicPage';
import SetlistsPage from './pages/SetlistsPage';
import ViewSetlistPage from './pages/ViewSetlistPage';
import PracticePage from './pages/practice/PracticePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMembersPage from './pages/AdminMembersPage';
import AdminFinancesPage from './pages/AdminFinancesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/fan-page" element={<FanPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/administration" element={<AdministrationPage />} />
      
      {/* Setlist fullscreen viewer (outside of dashboard layout) */}
      <Route path="/setlist/:id" element={
        <ProtectedRoute>
          <ViewSetlistPage />
        </ProtectedRoute>
      } />
      
      {/* Protected dashboard routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="sheet-music" element={
          <PermissionRoute requiredPermission="can_view_sheet_music">
            <SheetMusicPage />
          </PermissionRoute>
        } />
        <Route path="sheet-music/choral-titles" element={
          <PermissionRoute requiredPermission="can_view_sheet_music">
            <ChoralTitlesPage />
          </PermissionRoute>
        } />
        <Route path="sheet-music/:id" element={<ViewSheetMusicPage />} />
        <Route path="setlists" element={<SetlistsPage />} />
        <Route path="setlists/:id" element={<ViewSetlistPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="recordings" element={<RecordingsPage />} />
        <Route path="videos" element={<div>Videos Page</div>} />
        <Route path="dues" element={
          <PermissionRoute requiredPermission="can_view_financials">
            <div>Dues Payment Page</div>
          </PermissionRoute>
        } />
        <Route path="handbook" element={<div>Handbook Page</div>} />
        <Route path="merch" element={<div>Merchandise Page</div>} />
        <Route path="media-library" element={<div>Media Sources Page</div>} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="members" element={<div>Members Page</div>} />
        <Route path="announcements" element={
          <PermissionRoute requiredPermission="can_post_announcements">
            <div>Announcements Page</div>
          </PermissionRoute>
        } />
        <Route path="attendance" element={
          <PermissionRoute requiredPermission="can_edit_attendance">
            <AttendancePage />
          </PermissionRoute>
        } />
        <Route path="messages" element={<div>Messages Page</div>} />
        <Route path="performance-checklist" element={<PerformanceChecklistPage />} />
        <Route path="wardrobe-status" element={
          <PermissionRoute requiredPermission="can_view_wardrobe">
            <div>Wardrobe Status Page</div>
          </PermissionRoute>
        } />
        <Route path="wardrobe-admin" element={
          <PermissionRoute requiredPermission="can_edit_wardrobe">
            <div>Wardrobe Admin Page</div>
          </PermissionRoute>
        } />
        <Route path="tour" element={
          <PermissionRoute requiredPermission="can_manage_tour">
            <div>Tour Management Page</div>
          </PermissionRoute>
        } />
        <Route path="stage-plot" element={
          <PermissionRoute requiredPermission="can_manage_stage">
            <div>Stage Plot Manager Page</div>
          </PermissionRoute>
        } />
        <Route path="prayer" element={
          <PermissionRoute requiredPermission="can_view_prayer_box">
            <div>Prayer Requests Page</div>
          </PermissionRoute>
        } />
        <Route path="finances" element={
          <PermissionRoute requiredPermission="can_view_financials">
            <div>Financial Dashboard Page</div>
          </PermissionRoute>
        } />
        
        {/* Admin routes - Allow both super admins and admins */}
        <Route path="admin" element={
          <PermissionRoute>
            <AdminDashboardPage />
          </PermissionRoute>
        } />
        <Route path="admin/members" element={
          <PermissionRoute>
            <AdminMembersPage />
          </PermissionRoute>
        } />
        <Route path="admin/finances" element={
          <PermissionRoute>
            <AdminFinancesPage />
          </PermissionRoute>
        } />
        <Route path="admin/wardrobe" element={
          <PermissionRoute>
            <div>Wardrobe Management Page</div>
          </PermissionRoute>
        } />
        <Route path="admin/analytics" element={
          <PermissionRoute>
            <AdminAnalyticsPage />
          </PermissionRoute>
        } />
        <Route path="admin/settings" element={
          <PermissionRoute>
            <AdminSettingsPage />
          </PermissionRoute>
        } />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
