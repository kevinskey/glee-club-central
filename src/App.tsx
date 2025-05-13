
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  return (
    <div className="min-h-screen w-full bg-background font-inter">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
