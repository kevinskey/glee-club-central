
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Nuclear cache clearing - force complete reload if any cached modules exist
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    if (cacheNames.length > 0) {
      console.log('Clearing all caches and forcing reload...');
      Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      ).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      });
    }
  });
}

// Force reload if any glee-tools references exist in memory
const CACHE_BUSTER = `${Date.now()}-glee-tools-removed`;
console.log('Cache buster:', CACHE_BUSTER);

// Clear any module cache references
if (typeof window !== 'undefined') {
  // Force garbage collection of any cached module references
  window.dispatchEvent(new Event('beforeunload'));
  
  // Clear any potential service worker cache
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
