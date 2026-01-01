import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: "sm" | "default" | "lg"
  className?: string
}

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          {
            "h-4 w-4": size === "sm",
            "h-8 w-8": size === "default",
            "h-12 w-12": size === "lg",
          },
          className
        )} 
      />
      <p className={cn(
        "text-muted-foreground mt-4",
        {
          "text-xs": size === "sm",
          "text-sm": size === "default",
          "text-base": size === "lg",
        }
      )}>
        Loading...
      </p>
    </div>
  )
} 