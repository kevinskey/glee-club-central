
import React from 'react';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
