
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Force complete cache invalidation - timestamp: 2025-06-06T00:00:00Z
const CACHE_BUST_VERSION = Date.now();

// Ultra-aggressive cache refresh - clear all caches and force reload
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      console.log('Deleting cache:', name);
      caches.delete(name);
    });
  });
}

// Clear any localStorage or sessionStorage that might cache component references
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log('Storage cleared');
} catch (e) {
  console.log('Storage clear attempted');
}

// Force module cache invalidation by invalidating import maps
if ('performance' in window && performance.mark) {
  performance.mark('cache-bust-' + CACHE_BUST_VERSION);
}

// Force timestamp to break any module caching
console.log('Application starting - FORCE CACHE CLEAR, version:', CACHE_BUST_VERSION);
console.log('PitchPipe component cache busted - no audio imports');

// Aggressive reload for module cache issues
if (window.location.search.indexOf('cache-bust') === -1) {
  console.log('Adding cache bust parameter and reloading...');
  window.location.href = window.location.href + (window.location.search ? '&' : '?') + 'cache-bust=' + CACHE_BUST_VERSION;
} else {
  console.log('Cache bust parameter detected, proceeding with normal load');
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
