"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, User, Briefcase, ImageIcon, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Users, Palette, ShoppingBag, BookOpen } from "lucide-react"
import { ArtworkGallery } from "@/components/artwork-gallery"
import { NavBar } from "@/components/ui/tubelight-navbar"

export default function GalleriePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState("gallerie")

  const navItems = [
    { name: "Accueil", url: "/#accueil", icon: Home },
    { name: "Avis", url: "/#retours", icon: Mail },
    { name: "Portfolio", url: "/#about", icon: User },
    { name: "Contact", url: "/#contact", icon: Mail },
    { name: "Galerie", url: "/gallerie", icon: ImageIcon },
    { name: "Coaching", url: "/services#coaching", icon: Users },
    { name: "Commissions", url: "/services#commissions", icon: Palette },
    { name: "Print Shop", url: "/shop", icon: ShoppingBag },
    { name: "E-books", url: "/services#ebooks", icon: BookOpen },
  ]

  useEffect(() => {
    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Spotlight Background */}
      <div
        className="fixed inset-0 spotlight pointer-events-none z-0"
        style={
          {
            "--x": isClient ? `${(mousePosition.x / window.innerWidth) * 100}%` : "50%",
            "--y": isClient ? `${(mousePosition.y / window.innerHeight) * 100}%` : "50%",
          } as React.CSSProperties
        }
      />

      <NavBar items={navItems} activeSection={activeSection} />

      {/* Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/artwork-2.jpg"
              alt="Gallery Background"
              fill
              className="object-cover opacity-40"
              style={{ objectPosition: "center 30%" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/70" />
            {/* Reduced spotlight effect for hero background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={
                {
                  background: `radial-gradient(
                    circle at ${isClient ? `${(mousePosition.x / window.innerWidth) * 100}%` : "50%"} ${isClient ? `${(mousePosition.y / window.innerHeight) * 100}%` : "50%"},
                    rgba(139, 92, 246, 0.06) 0%,
                    rgba(139, 92, 246, 0.02) 25%,
                    transparent 50%
                  )`
                } as React.CSSProperties
              }
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Galerie Complete
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez l'ensemble de mes créations artistiques
            </p>
          </div>
        </section>

        {/* Artwork Gallery */}
        <div id="gallerie">
          <ArtworkGallery />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Image src="/images/logo.png" alt="Bobe Florian Logo" width={120} height={40} className="h-10 w-auto" />
              <p className="text-muted-foreground text-sm leading-relaxed">
                Artiste illustrateur passionné, créateur d'univers fantastiques et de personnages mémorables.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => window.location.href = "/#about"} className="hover:text-primary transition-colors">
                    À propos
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/gallerie"} className="hover:text-primary transition-colors">
                    Portfolio
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/#retours"} className="hover:text-primary transition-colors">
                    Avis
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/services#coaching"} className="hover:text-primary transition-colors">
                    Coaching
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = "/services#commissions"}
                    className="hover:text-primary transition-colors"
                  >
                    Commissions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = "/shop"}
                    className="hover:text-primary transition-colors"
                  >
                    Print Shop
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/services#ebooks"} className="hover:text-primary transition-colors">
                    E-books
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/#contact"} className="hover:text-primary transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Réseaux Sociaux</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://instagram.com/bobeflorian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liens Utiles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://www.artstation.com/bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Portfolio ArtStation
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/ZrfMKgCZ3W"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Discord Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitch.tv/bobeflorian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Twitch Stream
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Bobe Florian. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}