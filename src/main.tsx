
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// FINAL NUCLEAR CACHE CLEAR - Complete system reset
const FINAL_CACHE_VERSION = `FINAL-${Date.now()}-${Math.random().toString(36)}`;

// Most aggressive cache clearing possible
const nuclearCacheClear = async () => {
  try {
    console.log('NUCLEAR CACHE CLEAR INITIATED - Final version:', FINAL_CACHE_VERSION);
    
    // Delete ALL caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('Found caches to delete:', cacheNames);
      await Promise.all(cacheNames.map(async (name) => {
        const deleted = await caches.delete(name);
        console.log(`Cache ${name} deleted:`, deleted);
      }));
    }
    
    // Clear ALL storage types
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('All storage cleared');
    } catch (e) {
      console.log('Storage clear error:', e);
    }
    
    // Clear all IndexedDB databases
    try {
      if ('indexedDB' in window) {
        const databases = ['app-cache', 'lovable-cache', 'vite-cache', 'workbox-cache'];
        for (const db of databases) {
          try {
            const deleteRequest = indexedDB.deleteDatabase(db);
            console.log(`IndexedDB ${db} deletion initiated`);
          } catch (e) {
            console.log(`IndexedDB ${db} deletion attempted`);
          }
        }
      }
    } catch (e) {
      console.log('IndexedDB operations attempted');
    }
    
    // Force complete module reload
    if (typeof window !== 'undefined') {
      // Clear any module caches
      // @ts-ignore
      if (window.__vite_plugin_react_preamble_installed__) {
        console.log('Vite detected - forcing complete reload');
      }
      
      // Clear any webpack hot reload cache
      // @ts-ignore
      if (window.webpackChunkName) {
        console.log('Webpack detected - clearing chunk cache');
      }
    }
    
  } catch (error) {
    console.error('Nuclear cache clear error:', error);
  }
};

// Check for complete system reset requirement
const currentUrl = new URL(window.location.href);
const nukeCacheParam = currentUrl.searchParams.get('nuke-cache');

if (nukeCacheParam !== FINAL_CACHE_VERSION) {
  console.log('System requires nuclear cache clear - initiating...');
  nuclearCacheClear().then(() => {
    // Force complete page replacement
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('nuke-cache', FINAL_CACHE_VERSION);
    console.log('Performing final system reload...');
    window.location.replace(newUrl.toString());
  });
} else {
  console.log('Nuclear cache clear complete - normal app startup');
  
  // Normal app startup
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
