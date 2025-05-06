
import React from "react";
import { cn } from "@/lib/utils";

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
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
      {/* Cartoon singing lips logo */}
      <path d="M12 18.5c-3.5 0-6.5-1.5-8-4 1.5 0 3-1 4-2 1 1.5 2.5 2 4 2s3-.5 4-2c1 1 2.5 2 4 2-1.5 2.5-4.5 4-8 4z" />
      <path d="M12 13c-1.5 0-2.5-.5-3.5-1.5 1 1 2 1.5 3.5 1.5s2.5-.5 3.5-1.5c-1 1-2 1.5-3.5 1.5z" />
      <path d="M10 10c.5-1 1.5-1 2-1s1.5 0 2 1" />
      <path d="M10 16c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5" />
      <ellipse cx="12" cy="14" rx="8" ry="7" />
    </svg>
  ),
};
