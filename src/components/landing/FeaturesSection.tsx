
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function FeaturesSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-glee-dark">
      <div className="container px-2 md:px-8">
        <div className="text-center">
          <Button 
            className="bg-glee-purple hover:bg-glee-purple/90 inline-flex items-center gap-2"
            onClick={() => navigate("/login")}
            size={isMobile ? "default" : "lg"}
          >
            Enter Member Portal <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
