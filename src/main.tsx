
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// EMERGENCY CACHE CLEAR - Force complete rebuild
const EMERGENCY_VERSION = `${Date.now()}-${Math.random()}`;

// Nuclear cache clear option
const clearAllCaches = async () => {
  try {
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared:', cacheNames);
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any IndexedDB if present
    if ('indexedDB' in window) {
      try {
        indexedDB.deleteDatabase('app-cache');
      } catch (e) {
        console.log('IndexedDB clear attempted');
      }
    }
    
    console.log('EMERGENCY CACHE CLEAR COMPLETE - version:', EMERGENCY_VERSION);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

// Execute emergency clear
clearAllCaches();

// Force module invalidation with query params
const currentUrl = new URL(window.location.href);
if (!currentUrl.searchParams.has('emergency-clear')) {
  currentUrl.searchParams.set('emergency-clear', EMERGENCY_VERSION);
  console.log('Forcing emergency reload with cache bust...');
  window.location.href = currentUrl.toString();
} else {
  console.log('Emergency cache clear parameter detected, proceeding...');
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
