"use client"

import { cn } from "@/lib/utils"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "purple"
  size?: "default" | "lg"
  onClick?: () => void
  className?: string
}

export function Button({ children, variant = "primary", size = "default", onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-2xl transition-all active:translate-y-[2px] select-none",
        size === "default" && "px-7 py-3.5 text-base",
        size === "lg" && "px-8 py-4 text-lg",
        variant === "primary" && "bg-bcw-green text-white shadow-bcw hover:bg-bcw-green-dark active:shadow-[0_2px_0_#46A302]",
        variant === "secondary" && "bg-white text-bcw-text-primary border-2 border-bcw-text-primary shadow-bcw-black hover:bg-gray-50 active:shadow-[0_2px_0_#1A1F1A]",
        variant === "purple" && "bg-bcw-purple text-white shadow-bcw-purple hover:bg-bcw-purple-dark active:shadow-[0_2px_0_#7C5BC9]",
        className
      )}
    >
      {children}
    </button>
  )
}
