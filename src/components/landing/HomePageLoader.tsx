
import React from "react";

export const HomePageLoader = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading GleeWorld...</p>
        </div>
      </div>
    </div>
  );
};
