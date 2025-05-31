
import React from "react";
import { Icons } from "@/components/Icons";
import { Instagram, Youtube, Facebook } from "lucide-react";

interface SocialLink {
  platform: 'instagram' | 'youtube' | 'facebook' | 'tiktok';
  url: string;
  label?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinksProps {
  logoText?: string;
  tagline?: string;
  email?: string;
  socialLinks?: SocialLink[];
  siteLinks?: FooterLink[];
  developerCredit?: string;
  className?: string;
}

export function FooterLinks({
  logoText = "GleeWorld",
  tagline = "Spelman College Glee Club Official Site",
  email = "glee@spelman.edu",
  socialLinks = [
    { platform: 'instagram', url: 'https://instagram.com/spelmanglee', label: 'Instagram' },
    { platform: 'youtube', url: 'https://youtube.com/@SpelmanCollegeGleeClub', label: 'YouTube' },
    { platform: 'facebook', url: 'https://facebook.com/SpelmanGlee', label: 'Facebook' },
    { platform: 'tiktok', url: 'https://tiktok.com/@spelmanglee', label: 'TikTok' }
  ],
  siteLinks = [
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
    { label: 'Press Kit', href: '/press-kit' },
    { label: 'Fan Login', href: '/login' }
  ],
  developerCredit = "Built with ♪ for the Spelman Glee Club",
  className = ""
}: FooterLinksProps) {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'tiktok':
        return <Icons.tiktok className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className={`border-t bg-muted/50 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Icons.logo className="h-8 w-8" />
              <span className="text-xl font-playfair font-semibold text-glee-spelman">
                {logoText}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {tagline}
            </p>
            {email && (
              <div className="text-sm">
                <span className="text-muted-foreground">Contact us: </span>
                <a 
                  href={`mailto:${email}`}
                  className="text-glee-spelman hover:underline"
                >
                  {email}
                </a>
              </div>
            )}
          </div>

          {/* Site Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background hover:bg-glee-spelman hover:text-white transition-colors"
                  aria-label={social.label || social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Spelman College Glee Club. All rights reserved.
          </p>
          {developerCredit && (
            <p className="text-sm text-muted-foreground">
              {developerCredit}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
