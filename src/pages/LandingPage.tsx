
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, FileText, Calendar, Headphones, Mic, BookOpen, ArrowRight } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { NewsFeed } from "@/components/news/NewsFeed";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showNewsFeed, setShowNewsFeed] = useState(true);
  
  // Auto-hide the news feed after a shorter duration (2 seconds instead of default)
  useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000); // 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {showNewsFeed && <NewsFeed onClose={() => setShowNewsFeed(false)} />}
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-glee-purple" />
            <span className="font-playfair text-lg font-semibold text-glee-purple">
              Glee World
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Clock />
            <Button 
              variant="outline" 
              className="text-glee-purple border-glee-purple hover:bg-glee-purple/10" 
              onClick={() => navigate("/login")}
            >
              Member Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative bg-glee-dark py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-blend-overlay bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
              filter: "blur(1px)"
            }}
          ></div>
        </div>
        <div className="container relative z-10 mx-auto md:grid-cols-1 items-center">
          <div className="text-white space-y-6 md:pr-6 max-w-2xl mx-auto text-center md:text-left md:mx-0">
            <h1 className="font-playfair tracking-tight">
              <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">Spelman College</span>
              <span className="animate-gradient bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl font-bold">
                Glee Club
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed opacity-90">
              A distinguished ensemble with a rich heritage of musical excellence, directed by Dr. Kevin Phillip Johnson.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-glee-purple hover:bg-glee-purple/90 text-white"
                onClick={() => navigate("/login")}
              >
                Member Portal
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Performance Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Director Section */}
      <section className="py-20 bg-gradient-to-b from-white to-glee-light dark:from-glee-dark dark:to-black">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Led by <span className="text-glee-purple">Dr. Kevin Phillip Johnson</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Under the distinguished direction of Dr. Johnson, the Spelman College Glee Club 
              continues its legacy of musical excellence and cultural significance, performing 
              diverse repertoire from classical to contemporary works.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Hub Features */}
      <section className="py-20 bg-white dark:bg-glee-dark">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Our Digital Member Hub
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Designed exclusively for our members, our digital platform provides everything needed for rehearsals, performances, and administration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-40 bg-gradient-to-br from-glee-purple/80 to-glee-purple/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white/90" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Sheet Music Library</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access our complete digital library of sheet music, organized by voice part and performance program.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-40 bg-gradient-to-br from-glee-accent/80 to-glee-accent/20 flex items-center justify-center">
                  <Headphones className="h-16 w-16 text-white/90" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Practice Media</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Training recordings, sectionals, and warm-ups to help you master your part from anywhere.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-40 bg-gradient-to-br from-glee-purple/60 to-glee-accent/40 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-white/90" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Performance Calendar</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Stay informed with our rehearsal schedule, performance dates, and important events.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              className="bg-glee-purple hover:bg-glee-purple/90 inline-flex items-center gap-2"
              onClick={() => navigate("/login")}
            >
              Enter Member Portal <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Accolades/Quote Section */}
      <section className="py-20 bg-glee-purple/5 dark:bg-glee-dark/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Music className="h-10 w-10 text-glee-purple mx-auto mb-6 opacity-70" />
            <blockquote className="text-2xl md:text-3xl font-playfair italic mb-8">
              "The Spelman College Glee Club represents the pinnacle of collegiate choral excellence, with a century-long tradition of magnificent performances."
            </blockquote>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              — The New York Times
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-glee-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
            }}
          ></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6">Join Our Digital Choir Community</h2>
            <p className="text-lg mb-8 opacity-90">
              Access sheet music, submit recordings, check schedules, and connect with fellow members.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-glee-purple hover:bg-white/90"
              onClick={() => navigate("/login")}
            >
              Member Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white dark:bg-glee-dark">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Music className="h-6 w-6 text-glee-purple mr-2" />
              <span className="font-playfair text-xl font-semibold text-glee-purple">
                Glee World
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-glee-purple transition-colors">About</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-glee-purple transition-colors">Performances</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-glee-purple transition-colors">Contact</a>
              <Button 
                variant="ghost" 
                className="text-glee-purple hover:text-glee-purple/80"
                onClick={() => navigate("/login")}
              >
                Member Login
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Spelman College Glee Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
