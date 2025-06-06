
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Emergency cache clearing - this should force a complete rebuild
console.log('Starting application with emergency cache clearing...');

// Force clear all caches immediately
if ('caches' in window) {
  console.log('Clearing browser caches...');
  caches.keys().then(cacheNames => {
    console.log('Found caches:', cacheNames);
    Promise.all(
      cacheNames.map(cacheName => {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    ).then(() => {
      console.log('All caches cleared');
    });
  });
}

// Clear all storage
console.log('Clearing localStorage and sessionStorage...');
try {
  localStorage.clear();
  sessionStorage.clear();
} catch (e) {
  console.log('Storage clear error:', e);
}

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Found service workers:', registrations.length);
    registrations.forEach(registration => {
      console.log('Unregistering service worker');
      registration.unregister();
    });
  });
}

// Force module cache invalidation
const timestamp = Date.now();
console.log('Cache buster timestamp:', timestamp);

// Add timestamp to force module reloading
window.__CACHE_BUSTER__ = timestamp;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
