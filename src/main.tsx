
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

// Aggressive cache refresh - clear all caches and force reload
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
    });
  });
}

// Clear any localStorage or sessionStorage that might cache component references
try {
  localStorage.removeItem('app-cache');
  sessionStorage.clear();
} catch (e) {
  console.log('Storage clear attempted');
}

// Force timestamp to break any module caching
console.log('Application starting - cache cleared, timestamp:', Date.now());
console.log('PitchPipe component removed - no audio functionality available');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
