
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
