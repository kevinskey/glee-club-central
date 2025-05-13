
import React from "react";
import { useNavigate } from "react-router-dom";
import { Music, Instagram, Facebook, Youtube } from "lucide-react";
import { Icons } from "@/components/Icons";

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 sm:py-10 md:py-12 bg-white dark:bg-white">
      <div className="container px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="flex items-center">
            <Music className="h-5 w-5 sm:h-6 sm:w-6 text-glee-spelman mr-3" />
            <span className="font-playfair text-lg sm:text-xl font-semibold text-glee-spelman">
              Glee World
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
            <a href="/press-kit" className="text-sm text-gray-600 hover:text-glee-spelman transition-colors">Press Kit</a>
            <a href="/privacy" className="text-sm text-gray-600 hover:text-glee-spelman transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-glee-spelman transition-colors">Terms of Service</a>
            <a href="/about" className="text-sm text-gray-600 hover:text-glee-spelman transition-colors">About</a>
            <a href="/contact" className="text-sm text-gray-600 hover:text-glee-spelman transition-colors">Contact</a>
          </div>
        </div>
        
        {/* Social media links */}
        <div className="mt-8 flex justify-center gap-6">
          <a 
            href="https://www.instagram.com/spelmanglee/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-glee-spelman transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a 
            href="https://www.facebook.com/SpelmanGlee/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-glee-spelman transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a 
            href="https://www.tiktok.com/@spelmanglee" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-glee-spelman transition-colors"
            aria-label="TikTok"
          >
            <Icons.tiktok className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a 
            href="https://www.youtube.com/@SpelmanCollegeGleeClub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-glee-spelman transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Spelman College Glee Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
