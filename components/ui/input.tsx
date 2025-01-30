import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-none bg-white px-3 py-2",
        "text-lg font-bold",
        "border-3 border-black",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "focus-visible:outline-none focus-visible:ring-0",
        "placeholder:text-gray-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

