import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-colors",
          "border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
          {
            "bg-neo-yellow hover:bg-neo-pink": variant === "default",
            "bg-white hover:bg-gray-100": variant === "outline",
            "hover:bg-gray-100 shadow-none": variant === "ghost",
            "px-4 py-2": size === "default",
            "px-3 py-1 text-sm": size === "sm",
            "px-6 py-3 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }

