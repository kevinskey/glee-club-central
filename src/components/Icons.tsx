
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
      {/* Metronome icon */}
      <path d="M10 2v13.5" />
      <path d="m14 13.5 7 4.5V6l-7 4.5" />
      <path d="M2 19h20" />
      <path d="M5 15v-3h6v3c0 2.5-2.5 3.5-3 4-2.5-2.5 0-8 0-8" />
    </svg>
  ),
};
