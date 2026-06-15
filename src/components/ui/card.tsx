import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "green" | "purple" | "light-purple" | "light-green"
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white",
        variant === "green" && "bg-bcw-green-light border border-bcw-green",
        variant === "purple" && "bg-bcw-purple-light border border-bcw-purple",
        variant === "light-purple" && "bg-bcw-purple-light",
        variant === "light-green" && "bg-bcw-green-light",
        className
      )}
    >
      {children}
    </div>
  )
}
