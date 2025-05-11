
import React, { useState, useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { PerformanceSection } from "@/components/landing/performance/PerformanceSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { NewsFeed } from "@/components/news/NewsFeed";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("LandingPage component mounting");
    
    // Simulate checking resources are loaded
    const timer = setTimeout(() => {
      try {
        console.log("LandingPage finished loading");
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading landing page:", err);
        setError(err instanceof Error ? err : new Error("Failed to load page"));
        setIsLoading(false);
        
        toast({
          variant: "destructive",
          title: "Error loading page",
          description: "Please refresh the page or try again later.",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-background">
        <h2 className="text-2xl font-bold text-destructive mb-4">Failed to load page</h2>
        <p className="text-muted-foreground mb-4">Please refresh the page or try again later.</p>
        <button 
          className="px-4 py-2 bg-glee-purple text-white rounded-md hover:bg-glee-purple/90"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" id="home">
      <NewsFeed />
      <Header initialShowNewsFeed={false} />
      <HeroSection />
      <PerformanceSection />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
