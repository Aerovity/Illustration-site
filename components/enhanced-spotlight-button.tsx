"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface EnhancedSpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "outline"
  focusRingColor?: string
  gradientColor?: string
  sparkles?: boolean
}

export function EnhancedSpotlightButton({ children, className, variant, focusRingColor, gradientColor, sparkles, ...props }: EnhancedSpotlightButtonProps) {
  const focusRingClass = focusRingColor === 'golden' 
    ? "focus:ring-[#facc15] focus:ring-offset-[#fef3c7]" 
    : focusRingColor === 'silver'
    ? "focus:ring-[#c0c0c0] focus:ring-offset-[#f5f5f5]"
    : "focus:ring-purple-400 focus:ring-offset-slate-50"

  const gradientClass = gradientColor === 'golden'
    ? "bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#eab308_25%,#f59e0b_50%,#d97706_75%,#f59e0b_100%)]"
    : gradientColor === 'silver'
    ? "bg-[conic-gradient(from_90deg_at_50%_50%,#c0c0c0_0%,#e8e8e8_25%,#c0c0c0_50%,#f5f5f5_75%,#c0c0c0_100%)]"
    : "bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#a855f7_100%)]"

  return (
    <div className="relative">
      <button
        className={cn(
          "relative inline-flex h-12 overflow-hidden rounded-full p-[0.5px] focus:outline-none focus:ring-2 focus:ring-offset-2",
          focusRingClass,
          className
        )}
        {...props}
      >
        <span className={cn("absolute inset-[-1000%] animate-[spin_2s_linear_infinite]", gradientClass)} />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {children}
        </span>
      </button>
      
      {sparkles && (
        <>
          {/* Sparkle 1 - Floating up-right */}
          <div className="absolute -top-2 -right-2 w-1 h-1 bg-yellow-400 rounded-full animate-[sparkleFloat1_3s_ease-in-out_infinite]"></div>
          {/* Sparkle 2 - Floating down-left */}
          <div className="absolute -bottom-1 -left-3 w-0.5 h-0.5 bg-amber-300 rounded-full animate-[sparkleFloat2_4s_ease-in-out_infinite_0.5s]"></div>
          {/* Sparkle 3 - Floating up-left */}
          <div className="absolute top-1 -left-2 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-[sparkleFloat3_2.5s_ease-in-out_infinite_1s]"></div>
          {/* Sparkle 4 - Floating down-right */}
          <div className="absolute -bottom-2 -right-1 w-0.5 h-0.5 bg-orange-400 rounded-full animate-[sparkleFloat4_3.5s_ease-in-out_infinite_1.5s]"></div>
          {/* Sparkle 5 - Floating up */}
          <div className="absolute top-0 right-4 w-1 h-1 bg-amber-400 rounded-full animate-[sparkleFloat5_4.5s_ease-in-out_infinite_2s]"></div>
          {/* Sparkle 6 - Orbiting */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-[sparkleOrbit_6s_linear_infinite]"></div>
        </>
      )}
      
      <style jsx>{`
        @keyframes sparkleFloat1 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { transform: translate(-2px, -4px) scale(1) rotate(90deg); opacity: 1; }
          80% { transform: translate(-4px, -8px) scale(1) rotate(270deg); opacity: 1; }
          100% { transform: translate(-6px, -12px) scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes sparkleFloat2 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          25% { transform: translate(-3px, 2px) scale(1) rotate(120deg); opacity: 0.8; }
          75% { transform: translate(-6px, 4px) scale(1) rotate(240deg); opacity: 0.6; }
          100% { transform: translate(-9px, 6px) scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes sparkleFloat3 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          30% { transform: translate(-2px, -3px) scale(1.2) rotate(150deg); opacity: 1; }
          70% { transform: translate(-4px, -6px) scale(1) rotate(300deg); opacity: 0.8; }
          100% { transform: translate(-6px, -9px) scale(0) rotate(450deg); opacity: 0; }
        }
        
        @keyframes sparkleFloat4 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          15% { transform: translate(2px, 3px) scale(0.8) rotate(60deg); opacity: 0.7; }
          85% { transform: translate(4px, 6px) scale(1) rotate(300deg); opacity: 0.5; }
          100% { transform: translate(6px, 9px) scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes sparkleFloat5 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          40% { transform: translate(0, -5px) scale(1) rotate(180deg); opacity: 1; }
          60% { transform: translate(0, -8px) scale(1) rotate(270deg); opacity: 0.8; }
          100% { transform: translate(0, -12px) scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes sparkleOrbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(30px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(30px) rotate(-360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
