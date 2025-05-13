
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
