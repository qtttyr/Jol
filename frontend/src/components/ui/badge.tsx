import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'indigo' | 'green' | 'orange' | 'red' | 'destructive' | 'secondary' | 'outline' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-muted text-foreground",
    indigo: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
    green: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    red: "bg-red-500/10 text-red-500 border border-red-500/20",
    destructive: "bg-red-500/10 text-red-500 border border-red-500/20",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
