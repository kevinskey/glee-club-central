
import React from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="border-t py-6 sm:py-8 md:py-10 lg:py-12 bg-white dark:bg-white">
      <div className="container px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-5 sm:mb-6 md:mb-0">
            <Music className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-glee-purple mr-2" />
            <span className="font-playfair text-base sm:text-lg md:text-xl font-semibold text-glee-purple">
              Glee World
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <a href="/about" className="text-sm sm:text-base text-gray-600 dark:text-gray-600 hover:text-glee-spelman transition-colors">About</a>
            <a href="#" className="text-sm sm:text-base text-gray-600 dark:text-gray-600 hover:text-glee-spelman transition-colors">Performances</a>
            <a href="#" className="text-sm sm:text-base text-gray-600 dark:text-gray-600 hover:text-glee-spelman transition-colors">Contact</a>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Button 
                variant="ghost" 
                className="text-glee-purple hover:text-white hover:bg-glee-spelman"
                onClick={() => navigate("/fan-page")}
              >
                Guest Access
              </Button>
              <Button 
                variant="ghost" 
                className="text-glee-purple hover:text-white hover:bg-glee-spelman"
                onClick={() => navigate("/login")}
              >
                Member Portal
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-6 md:mt-8 pt-5 sm:pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-200 text-center text-gray-500 dark:text-gray-500 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Spelman College Glee Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
