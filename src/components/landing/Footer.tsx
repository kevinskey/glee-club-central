
import React from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const navigate = useNavigate();
  
  return (
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
  );
}
