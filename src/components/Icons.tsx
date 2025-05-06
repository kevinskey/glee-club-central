
import React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <Globe className={cn("h-6 w-6 text-black dark:text-white", props.className)} {...props} />
  ),
};
