
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const mobileButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 max-w-full overflow-hidden text-ellipsis touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-medium hover:bg-accent",
        destructive: "bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90",
        outline: "border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground font-medium hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent font-medium hover:text-accent-foreground",
        link: "text-primary font-medium underline-offset-4 hover:underline",
        spelman: "bg-blue-500 text-white font-medium hover:bg-blue-600",
      },
      size: {
        default: "h-11 px-4 py-2 min-h-[44px] min-w-[44px] text-sm sm:text-base",
        sm: "h-11 rounded-md px-3 text-xs min-h-[44px] min-w-[44px] sm:text-sm",
        lg: "h-12 rounded-md px-6 text-base sm:text-lg min-h-[48px]",
        xl: "h-14 rounded-md px-8 text-lg sm:text-xl min-h-[56px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-2",
        "icon-sm": "h-11 w-11 min-h-[44px] min-w-[44px] p-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface MobileOptimizedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mobileButtonVariants> {
  asChild?: boolean
}

const MobileOptimizedButton = React.forwardRef<HTMLButtonElement, MobileOptimizedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(mobileButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
MobileOptimizedButton.displayName = "MobileOptimizedButton"

export { MobileOptimizedButton, mobileButtonVariants }
