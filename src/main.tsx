
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerServiceWorker } from './registerServiceWorker';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// Register service worker for PWA capability
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
