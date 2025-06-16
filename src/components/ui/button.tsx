
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 max-w-full overflow-hidden text-ellipsis",
  {
    variants: {
      variant: {
        default: "bg-[#0072CE] text-white font-medium hover:bg-[#0072CE]/90",
        destructive: "bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90",
        outline: "border border-[#0072CE] bg-white text-[#0072CE] font-medium hover:bg-[#0072CE]/10",
        secondary: "bg-gray-100 text-gray-900 font-medium hover:bg-gray-200",
        ghost: "hover:bg-gray-100 font-medium hover:text-gray-900",
        link: "text-[#0072CE] font-medium underline-offset-4 hover:underline",
        spelman: "bg-[#0072CE] text-white font-medium hover:bg-[#0072CE]/90",
      },
      size: {
        default: "h-10 px-6 py-2 min-h-[44px]",
        sm: "h-9 rounded-md px-4 text-sm min-h-[44px]",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
