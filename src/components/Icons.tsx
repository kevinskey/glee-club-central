
import React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export type IconProps = React.HTMLAttributes<SVGElement>;

// Define a separate type for image-based icons
export type ImageIconProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, keyof React.SVGAttributes<SVGElement>>;

export const Icons = {
  logo: (props: ImageIconProps) => (
    <img 
      src="/lovable-uploads/cb5429e5-ef5e-4b87-8109-1e1216828e19.png" 
      alt="Spelman College Glee Club Logo" 
      className={cn("h-6 w-auto", props.className)} 
      {...props} 
    />
  ),
  globe: (props: IconProps) => (
    <Globe className={cn("h-6 w-6 text-black dark:text-white", props.className)} {...props} />
  ),
};
