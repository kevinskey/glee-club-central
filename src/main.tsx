
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Force complete cache invalidation - emergency measure
const CACHE_BUST_VERSION = `v${Date.now()}-${Math.random().toString(36).substring(7)}`;

// Nuclear option - clear everything and force reload
const emergencyCacheClear = async () => {
  try {
    console.log('EMERGENCY CACHE CLEAR INITIATED - version:', CACHE_BUST_VERSION);
    
    // Clear all possible caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Browser caches cleared:', cacheNames.length);
    }
    
    // Clear all storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Storage cleared');
    } catch (e) {
      console.log('Storage clear attempted');
    }
    
    // Clear IndexedDB
    try {
      if ('indexedDB' in window) {
        const databases = ['app-cache', 'lovable-cache', 'vite-cache'];
        databases.forEach(db => {
          try {
            indexedDB.deleteDatabase(db);
          } catch (e) {
            console.log(`IndexedDB ${db} clear attempted`);
          }
        });
      }
    } catch (e) {
      console.log('IndexedDB clear attempted');
    }
    
    // Force module cache invalidation
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.__vite_plugin_react_preamble_installed__) {
        console.log('Vite cache detected, forcing reload');
      }
    }
    
  } catch (error) {
    console.error('Emergency cache clear error:', error);
  }
};

// Check if we need to force a hard reload
const currentUrl = new URL(window.location.href);
const cacheParam = currentUrl.searchParams.get('cache-bust');

if (cacheParam !== CACHE_BUST_VERSION) {
  console.log('Cache version mismatch, forcing hard reload...');
  emergencyCacheClear().then(() => {
    currentUrl.searchParams.set('cache-bust', CACHE_BUST_VERSION);
    window.location.replace(currentUrl.toString());
  });
} else {
  console.log('Cache version matches, proceeding with normal load');
  
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
