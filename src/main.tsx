
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerServiceWorker } from './registerServiceWorker';
import './index.css';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Direct import from router.tsx

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Supabase client for auth helpers
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dzzptovqfqausipsgabw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Register service worker for PWA capability
registerServiceWorker();

// Create the root once
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found in the document");
}

const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
