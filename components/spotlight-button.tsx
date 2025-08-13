"use client"

import type React from "react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

interface SpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "outline"
}

export function SpotlightButton({ children, className, variant = "default", ...props }: SpotlightButtonProps) {
  return (
    <HoverBorderGradient
      containerClassName={className}
      {...props}
    >
      {children}
    </HoverBorderGradient>
  )
}
