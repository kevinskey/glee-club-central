
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
    <footer className="border-t py-10 sm:py-12 md:py-14 bg-white dark:bg-gray-950">
      <div className="container px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png" 
                alt="Spelman College Glee Club" 
                className="h-16 mr-4"
              />
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-glee-spelman mb-1">
                  Glee World
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Spelman College Glee Club Official Site
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The Spelman College Glee Club has maintained a standard of choral excellence for women of African descent for over 95 years.
            </p>
            <div className="text-sm">
              <span className="text-muted-foreground">Contact us: </span>
              <a 
                href="mailto:gleeworld@spelman.edu"
                className="text-glee-spelman hover:underline"
              >
                gleeworld@spelman.edu
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Social media links */}
        <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 my-6">
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-glee-spelman transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            © {currentYear} Spelman College Glee Club. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ♪ for the Spelman Glee Club
          </p>
        </div>
      </div>
    </footer>
  );
}
