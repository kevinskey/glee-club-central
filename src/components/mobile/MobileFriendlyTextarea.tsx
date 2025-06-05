
import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileFriendlyTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const MobileFriendlyTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MobileFriendlyTextareaProps
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "sm:text-sm", // Prevent zoom on iOS
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
MobileFriendlyTextarea.displayName = "MobileFriendlyTextarea"

export { MobileFriendlyTextarea }
