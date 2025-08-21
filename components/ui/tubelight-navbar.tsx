"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeSection?: string
  showCart?: boolean
  cartCount?: number
  onCartClick?: () => void
}

export function NavBar({ items, className, activeSection, showCart = false, cartCount = 0, onCartClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    handleResize()
    handleScroll()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (activeSection) {
      // Map section IDs to nav item names
      const sectionToNavMap: { [key: string]: string } = {
        accueil: "Accueil",
        retours: "Avis",
        about: "Portfolio",
        gallery: "Galerie",
        contact: "Contact",
        coaching: "Coaching",
        commissions: "Commissions",
        "print-shop": "Print Shop",
        ebooks: "Ressources",
      }

      const navName = sectionToNavMap[activeSection]
      if (navName) {
        setActiveTab(navName)
      }
    }
  }, [activeSection])

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out pointer-events-none",
        isScrolled
          ? "bottom-0 sm:top-4 mb-6 sm:mb-0" // Compact navbar when scrolled
          : "top-0 w-full max-w-none", // Full header when at top
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center backdrop-blur-lg shadow-lg transition-all duration-500 ease-in-out pointer-events-auto",
          isScrolled
            ? "gap-1 py-1 px-3 rounded-full bg-background/90 border border-border/80 scale-95" // Compact style
            : isMobile
            ? "gap-1 py-3 px-4 rounded-none bg-background/5 border-b border-border w-full justify-between" // Mobile full header style
            : "gap-6 py-6 px-8 rounded-none bg-background/5 border-b border-border w-full justify-between", // Desktop full header style
        )}
      >
        <div className={cn("flex items-center transition-all duration-500", isScrolled ? "hidden" : "flex")}>
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Bobe Florian Logo"
              width={isScrolled ? 40 : isMobile ? 50 : 60}
              height={isScrolled ? 40 : isMobile ? 50 : 60}
              className={cn(
                "object-contain hover:scale-105 transition-all duration-300",
                isScrolled ? "w-10 h-10" : isMobile ? "w-12 h-12" : "w-15 h-15",
              )}
              priority
            />
          </Link>
        </div>

        <div className={cn("flex items-center transition-all duration-500", isScrolled ? "gap-1" : isMobile ? "gap-1" : "gap-4")}>
          {items.slice(0, isMobile && !isScrolled ? 5 : items.length).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                  "text-foreground/80 hover:text-primary",
                  isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-6 py-3", // Different padding for each state
                  isActive && "bg-muted text-primary",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={isMobile && !isScrolled ? 16 : 18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full rounded-full -z-10"
                    style={{ backgroundColor: "#c3b383" + "20" }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 rounded-t-full transition-all duration-300",
                        isScrolled ? "-top-2 w-8 h-1" : isMobile ? "-top-2 w-6 h-1" : "-top-3 w-10 h-2",
                      )}
                      style={{ backgroundColor: "#c3b383" }}
                    >
                      <div
                        className={cn(
                          "absolute rounded-full blur-md -left-2 transition-all duration-300",
                          isScrolled ? "w-12 h-6 -top-2" : isMobile ? "w-10 h-4 -top-2" : "w-14 h-8 -top-3",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                      <div
                        className={cn(
                          "absolute rounded-full blur-md transition-all duration-300",
                          isScrolled ? "w-8 h-6 -top-1" : isMobile ? "w-6 h-4 -top-1" : "w-10 h-8 -top-2",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                      <div
                        className={cn(
                          "absolute rounded-full blur-sm transition-all duration-300",
                          isScrolled ? "w-4 h-4 top-0 left-2" : isMobile ? "w-3 h-3 top-0 left-1.5" : "w-6 h-6 top-0 left-2",
                        )}
                        style={{ backgroundColor: "#c3b383" + "33" }}
                      />
                    </div>
                  </motion.div>
                )}
              </Link>
            )
          })}
          
          {/* Cart Icon - Only show when showCart is true */}
          {showCart && (
            <button
              onClick={onCartClick}
              className={cn(
                "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                "text-foreground/80 hover:text-primary bg-primary/20 hover:bg-primary/30",
                isScrolled ? "px-3 py-1.5" : isMobile ? "px-2 py-1.5" : "px-6 py-3",
                "flex items-center gap-2"
              )}
            >
              <ShoppingCart size={isMobile && !isScrolled ? 16 : 18} strokeWidth={2.5} />
              <span className={cn("font-medium", isScrolled ? "text-xs" : "text-sm")}>
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
