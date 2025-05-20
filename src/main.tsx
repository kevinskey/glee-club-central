
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from "./components/ErrorBoundary";
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

// Create the root once
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found in the document");
}

const root = ReactDOM.createRoot(rootElement);

// Render the app with minimal providers
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
