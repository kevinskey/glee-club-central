
import React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export type IconProps = React.HTMLAttributes<SVGElement>;

// Define a separate type for image-based icons that includes className
export type ImageIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const Icons = {
  logo: (props: ImageIconProps) => {
    const { theme } = useTheme();
    
    // Use different logo based on theme
    const logoSrc = theme === "dark" 
      ? "/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png" 
      : "/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png";
    
    return (
      <img 
        src={logoSrc}
        alt="Spelman College Glee Club Logo" 
        className={cn("h-6 w-auto", props.className)} 
        {...props} 
      />
    );
  },
  globe: (props: IconProps) => (
    <Globe className={cn("h-6 w-6 text-black dark:text-white", props.className)} {...props} />
  ),
  tiktok: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", props.className)}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      <path d="M15 8c0 5 4 5 4 8s-1 4-4 4" />
      <path d="M4 16c0-2 3-2 3-5s-1-3-3-3" />
      <path d="M15 18c1 0 2-1 2-2s-1-2-2-2" />
      <path d="M15 18c-1 0-2-1-2-2" />
      <path d="M15 4v14" />
    </svg>
  ),
};
