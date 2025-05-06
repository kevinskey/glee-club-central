
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const navigate = useNavigate();
  
  return (
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
  );
}
