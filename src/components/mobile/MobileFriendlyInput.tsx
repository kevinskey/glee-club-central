
import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileFriendlyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const MobileFriendlyInput = React.forwardRef<HTMLInputElement, MobileFriendlyInputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[44px] sm:text-sm", // Ensure minimum touch target and prevent zoom on iOS
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
MobileFriendlyInput.displayName = "MobileFriendlyInput"

export { MobileFriendlyInput }
