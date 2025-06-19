
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "glee-button-base",
  {
    variants: {
      variant: {
        default: "glee-button-primary",
        destructive: "bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90",
        outline: "glee-button-secondary",
        secondary: "bg-gray-100 text-gray-900 font-medium hover:bg-gray-200",
        ghost: "glee-button-ghost",
        link: "text-[#0072CE] font-medium underline-offset-4 hover:underline",
        spelman: "glee-button-primary",
      },
      size: {
        default: "h-10 px-6 py-2 min-h-[44px]",
        sm: "h-9 glee-corners px-4 text-sm min-h-[44px]",
        lg: "h-12 glee-corners-lg px-8 text-base",
        xl: "h-14 glee-corners-lg px-10 text-lg",
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
