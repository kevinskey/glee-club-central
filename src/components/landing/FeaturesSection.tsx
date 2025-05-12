
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function FeaturesSection() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-glee-dark">
      <div className="container px-2 md:px-8">
        {/* Empty container maintained for spacing/layout purposes */}
      </div>
    </section>
  );
}
