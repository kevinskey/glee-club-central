
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ConsolidatedHeader } from '@/components/layout/ConsolidatedHeader';
import { Footer } from '@/components/landing/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { HeroImageInitializer } from '@/components/landing/HeroImageInitializer';

interface AppLayoutProps {
  sidebarType?: 'member' | 'admin' | 'none';
  showHeader?: boolean;
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  sidebarType = 'none', 
  showHeader = true, 
  showFooter = false 
}) => {
  // Safely get auth context - handle case where it might not be available
  let isAuthenticated = false;
  let isAdmin = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isAdmin = auth.isAdmin ? auth.isAdmin() : false;
  } catch (error) {
    // If useAuth fails, we're outside AuthProvider - that's ok for public routes
    console.log('AppLayout: Auth context not available, treating as unauthenticated');
  }

  const shouldShowSidebar = sidebarType !== 'none' && isAuthenticated;
  const SidebarComponent = sidebarType === 'admin' ? AdminSidebar : Sidebar;

  return (
    <div className="min-h-screen bg-background">
      <HeroImageInitializer />
      
      {showHeader && <ConsolidatedHeader />}
      
      <div className="flex">
        {shouldShowSidebar && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarComponent />
          </div>
        )}
        
        <main className="flex-1 min-h-screen">
          {shouldShowSidebar && (
            <div className="lg:hidden">
              <MobileBottomNav isAdmin={isAdmin} />
            </div>
          )}
          
          <div className={`${shouldShowSidebar ? 'p-6' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
