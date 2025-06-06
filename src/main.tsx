
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Declare the custom property on window
declare global {
  interface Window {
    __CACHE_BUSTER__?: number;
  }
}

// NUCLEAR CACHE CLEARING - Force complete application rebuild
console.log('NUCLEAR CACHE CLEAR: Starting application with complete cache invalidation...');

// Step 1: Clear all browser caches aggressively
if ('caches' in window) {
  console.log('Step 1: Clearing all browser caches...');
  caches.keys().then(cacheNames => {
    console.log('Found caches to delete:', cacheNames);
    Promise.all(
      cacheNames.map(cacheName => {
        console.log('Force deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    ).then(() => {
      console.log('All browser caches forcefully cleared');
    });
  });
}

// Step 2: Clear all storage completely
console.log('Step 2: Clearing all storage...');
try {
  localStorage.clear();
  sessionStorage.clear();
  // Clear IndexedDB if it exists
  if ('indexedDB' in window) {
    indexedDB.databases?.().then(databases => {
      databases.forEach(db => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
          console.log('Deleted IndexedDB:', db.name);
        }
      });
    });
  }
} catch (e) {
  console.log('Storage clear error (expected):', e);
}

// Step 3: Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Step 3: Found service workers to unregister:', registrations.length);
    registrations.forEach(registration => {
      console.log('Force unregistering service worker');
      registration.unregister();
    });
  });
}

// Step 4: Force module cache invalidation with timestamp
const timestamp = Date.now();
console.log('Step 4: Cache buster timestamp:', timestamp);
window.__CACHE_BUSTER__ = timestamp;

// Step 5: Add cache-busting to document head
const meta = document.createElement('meta');
meta.httpEquiv = 'Cache-Control';
meta.content = 'no-cache, no-store, must-revalidate';
document.head.appendChild(meta);

const pragma = document.createElement('meta');
pragma.httpEquiv = 'Pragma';
pragma.content = 'no-cache';
document.head.appendChild(pragma);

const expires = document.createElement('meta');
expires.httpEquiv = 'Expires';
expires.content = '0';
document.head.appendChild(expires);

console.log('Step 5: Added cache-busting meta tags');

// Step 6: Force reload if we detect old cached components
const checkForOldCache = () => {
  if (window.location.hash.includes('glee-tools') || 
      document.querySelector('[data-component*="glee-tools"]') ||
      document.querySelector('[data-component*="PitchPipe"]')) {
    console.log('Step 6: Detected old cached components, forcing hard reload...');
    window.location.reload(true);
    return;
  }
};

// Run cache check after DOM loads
setTimeout(checkForOldCache, 100);

console.log('All cache clearing steps completed, proceeding with app initialization...');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
