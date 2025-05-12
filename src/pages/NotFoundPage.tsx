
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-4 md:p-6">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-glee-purple">404</h1>
            <h2 className="text-2xl font-medium text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <BackButton 
              label="Go Back"
              fallbackPath="/dashboard"
              className="justify-center m-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
