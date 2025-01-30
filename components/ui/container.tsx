import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border-3 border-black",
          !noPadding && "p-4",
          "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Container.displayName = "Container"

export { Container }

