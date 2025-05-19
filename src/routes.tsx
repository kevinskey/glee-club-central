
import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";

// Lazy-loaded components for better performance
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const MediaLibraryPage = lazy(() => import("./pages/MediaLibraryIntegratedPage"));
const PressKitPage = lazy(() => import("./pages/PressKitPage"));
const AdminMediaLibraryPage = lazy(() => import("./pages/admin/MediaLibraryPage"));
const SiteImagesPage = lazy(() => import("./pages/admin/SiteImagesPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "media-library",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MediaLibraryPage />
          </Suspense>
        ),
      },
      {
        path: "press-kit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PressKitPage />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: "media-library",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminMediaLibraryPage />
              </Suspense>
            ),
          },
          {
            path: "site-images",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SiteImagesPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
