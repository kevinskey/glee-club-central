
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Icons } from "@/components/Icons";

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { label: "About", href: "/about" },
    { label: "Calendar", href: "/calendar" },
    { label: "Contact", href: "/contact" },
    { label: "Store", href: "/store" },
    { label: "Join Glee Fam", href: "/join-glee-fam" }
  ];

  const legalLinks = [
    { label: "Press Kit", href: "/press-kit" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" }
  ];
  
  const socialLinks = [
    { 
      icon: <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />, 
      href: "https://www.instagram.com/spelmanglee/", 
      label: "Instagram" 
    },
    { 
      icon: <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />, 
      href: "https://www.facebook.com/SpelmanGlee/", 
      label: "Facebook" 
    },
    { 
      icon: <Icons.tiktok className="h-5 w-5 sm:h-6 sm:w-6" />, 
      href: "https://www.tiktok.com/@spelmanglee", 
      label: "TikTok" 
    },
    { 
      icon: <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />, 
      href: "https://www.youtube.com/@SpelmanCollegeGleeClub", 
      label: "YouTube" 
    },
    { 
      icon: <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />, 
      href: "https://twitter.com/spelmangleeclub", 
      label: "Twitter" 
    }
  ];
  
  return (
    <footer className="glee-footer py-8 md:py-12 mt-8 md:mt-16">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mb-6 sm:mb-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src="/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png" 
                alt="Spelman College Glee Club" 
                className="h-12 sm:h-16 mr-3 sm:mr-4"
              />
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#0072CE] mb-1">
                  Glee World
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Spelman College Glee Club Official Site
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black dark:text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#0072CE] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black dark:text-white">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#0072CE] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Social media links */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-4 sm:py-6 my-4 sm:my-6">
          <div className="flex justify-center gap-4 sm:gap-6">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-[#0072CE] transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-1 sm:mb-2">
            © {currentYear} Spelman College Glee Club. All rights reserved.
          </p>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Built with ♪ for the Spelman Glee Club
          </p>
        </div>
      </div>
    </footer>
  );
}
