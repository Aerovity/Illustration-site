"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, User, Briefcase, ImageIcon, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Users, Palette, ShoppingBag, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { MainPortfolio } from "@/components/main-portfolio"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { NavBar } from "@/components/ui/tubelight-navbar"

// Hero Background Component with auto-switching between image and video
function HeroBackground({ showVideo, onVideoEnd }: { showVideo: boolean; onVideoEnd: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (showVideo && videoRef.current) {
      // Reset and play video when transitioning to video slide
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(console.error)
    }
  }, [showVideo])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${showVideo ? "transform translate-x-[-100%]" : "transform translate-x-0"}`}>
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-top opacity-40"
          style={{ objectPosition: "center 20%" }}
          priority
        />
      </div>
      <div className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${showVideo ? "transform translate-x-0" : "transform translate-x-full"}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplaybook"
          className="w-full h-full object-cover object-top opacity-60"
          style={{ objectPosition: "center 20%" }}
          onEnded={onVideoEnd}
          webkit-playsinline="true"
        >
          <source src="/video_promo.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

// Hero Overlay Component that adjusts transparency based on video state
function HeroOverlay({ showVideo }: { showVideo: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-20 transition-all duration-1000 ${
        showVideo
          ? "bg-gradient-to-b from-background/20 via-background/10 to-background/60"
          : "bg-gradient-to-b from-background/60 via-background/40 to-background"
      }`}
    />
  )
}

function SlideIndicators({ showVideo, onSlideChange }: { showVideo: boolean; onSlideChange: (slideIndex: number) => void }) {
  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
      <button
        onClick={() => onSlideChange(0)}
        className={`w-5 h-5 rounded-full transition-all duration-500 cursor-pointer hover:scale-125 ${
          !showVideo ? "bg-white shadow-lg scale-110" : "bg-white/40 hover:bg-white/60"
        }`}
        aria-label="Go to slide 1"
      />
      <button
        onClick={() => onSlideChange(1)}
        className={`w-5 h-5 rounded-full transition-all duration-500 cursor-pointer hover:scale-125 ${
          showVideo
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/25 scale-110"
            : "bg-white/40 hover:bg-white/60"
        }`}
        aria-label="Go to slide 2"
      />
    </div>
  )
}

// Hero Content Component with different content for each slide
function HeroContent({
  showVideo,
  scrollToSection,
}: {
  showVideo: boolean
  scrollToSection: (section: string) => void
}) {
  return (
    <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
      {!showVideo ? (
        // Slide 1: Original Bobe Florian content (no golden button)
        <>
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
              Bobe Florian
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animate-delay-100">
              Artiste Illustrateur • Formation Coaching Pro
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Donnez vie à vos rêves et vos histoires à travers des illustrations uniques . Croissant Illustrator
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
            <EnhancedSpotlightButton
              onClick={() => (window.location.href = "/services")}
              className="px-0.5 py-0.5 text-lg"
            >
              Voir mes Services
            </EnhancedSpotlightButton>
            <EnhancedSpotlightButton
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="px-0.5 py-0.5 text-lg"
            >
              Me Contacter
            </EnhancedSpotlightButton>
          </div>
        </>
      ) : (
        // Slide 2: Coaching Pro content during video (no transparency)
        <>
          <div className="transition-all duration-1000 ease-out transform translate-y-0 opacity-100">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-fade-in-up">
              ✧ Coaching Pro
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              vous souhaitez passer au niveau supérieur et devenir illustrateur pro, concept artist ou simplement
              devenir meilleur en digital painting !
            </p>
          </div>
          <div className="flex justify-center animate-fade-in-up animate-delay-300">
            <EnhancedSpotlightButton
              onClick={() => (window.location.href = "/services")}
              focusRingColor="golden"
              gradientColor="golden"
              sparkles={true}
              className="px-0.5 py-0.5 text-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-1000 ease-out transform translate-y-0 opacity-100"
            >
              Rejoindre les cours ✧
            </EnhancedSpotlightButton>
          </div>
        </>
      )}
    </div>
  )
}

// Combined Hero Section Component
function HeroSection({
  scrollToSection,
}: {
  scrollToSection: (section: string) => void
}) {
  const [showVideo, setShowVideo] = useState(false)
  const [autoSlideTimeout, setAutoSlideTimeout] = useState<NodeJS.Timeout | null>(null)

  const clearAutoSlideTimeout = () => {
    if (autoSlideTimeout) {
      clearTimeout(autoSlideTimeout)
      setAutoSlideTimeout(null)
    }
  }

  const startAutoSlide = (fromVideo = false) => {
    clearAutoSlideTimeout()
    const timeout = setTimeout(() => {
      setShowVideo(!fromVideo)
    }, fromVideo ? 4000 : 8000) // Show video for 8 seconds, image for 4 seconds
    setAutoSlideTimeout(timeout)
  }

  useEffect(() => {
    // Start with image for 8 seconds, then switch to video
    setShowVideo(false)
    startAutoSlide(false)
    
    return () => clearAutoSlideTimeout()
  }, [])

  const handleVideoEnd = () => {
    // When video ends, show image for 8 seconds, then restart cycle
    setShowVideo(false)
    startAutoSlide(false)
  }

  const handleSlideChange = (slideIndex: number) => {
    clearAutoSlideTimeout()
    const targetShowVideo = slideIndex === 1
    setShowVideo(targetShowVideo)
    startAutoSlide(targetShowVideo)
  }

  return (
    <>
      <HeroBackground showVideo={showVideo} onVideoEnd={handleVideoEnd} />
      <HeroOverlay showVideo={showVideo} />
      <HeroContent showVideo={showVideo} scrollToSection={scrollToSection} />
      <SlideIndicators showVideo={showVideo} onSlideChange={handleSlideChange} />
    </>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  const navItems = [
    { name: "Accueil", url: "#accueil", icon: Home },
    { name: "Avis", url: "#retours", icon: Mail },
    { name: "Portfolio", url: "#about", icon: User },
    { name: "Galerie", url: "/gallerie", icon: ImageIcon },
    { name: "Contact", url: "#contact", icon: Mail },
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "accueil",
        "retours",
        "about",
        "gallery",
        "contact",
        "coaching",
        "commissions",
        "print-shop",
        "ebooks",
      ]

      let current = sections[0]
      let closestSection = ""
      let closestDistance = Number.POSITIVE_INFINITY

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const distanceFromTop = Math.abs(rect.top)

          // If section is in viewport, check which one is closest to top
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (distanceFromTop < closestDistance) {
              closestDistance = distanceFromTop
              closestSection = sectionId
            }
          }
        }
      }

      if (closestSection) {
        current = closestSection
      }

      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (
      sectionId === "coaching" ||
      sectionId === "commissions" ||
      sectionId === "print-shop" ||
      sectionId === "ebooks"
    ) {
      // Navigate to services page for these sections
      window.location.href = `/services#${sectionId}`
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  const handleSendRequest = () => {
    const fullName = (document.getElementById("fullName") as HTMLInputElement)?.value || ""
    const email = (document.getElementById("email") as HTMLInputElement)?.value || ""
    const projectType = (document.getElementById("projectType") as HTMLSelectElement)?.value || ""
    const projectDescription = (document.getElementById("projectDescription") as HTMLTextAreaElement)?.value || ""

    const emailSubject = `Nouvelle demande de devis - ${projectType}`
    const emailBody = `Bonjour Bobe Florian,

Je souhaiterais obtenir un devis pour le projet suivant :

Informations du client :
- Nom : ${fullName}
- Email : ${email}

Détails du projet :
- Type de projet : ${projectType}
- Description : ${projectDescription}

Merci de me faire parvenir votre estimation et vos disponibilités.

Cordialement,
${fullName}`

    const mailtoLink = `mailto:contact@bobeflorian.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

    window.open(mailtoLink, "_blank")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Spotlight Background */}
      <div
        className="fixed inset-0 spotlight pointer-events-none z-20"
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
        <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <HeroSection scrollToSection={scrollToSection} />
        </section>

        {/* Reviews Section */}
        <section id="retours" className="py-10 px-4 relative z-10">
          <ReviewsCarousel />
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 relative z-10 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/à propos background .png"
              alt="À propos background"
              fill
              className="object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
          </div>
          
          <div className="max-w-6xl mx-auto relative z-30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  À Propos de Moi
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Grand passionné de l'art depuis mon plus jeune âge, je dessine avec assiduité depuis maintenant plus de 8 ans et propose aujourd'hui mes compétences en tant qu'illustrateur freelance. J'apprécie particulièrement la réalisation de fanarts issus de mangas et d'animes, mais je crée également des OC et personnages issus de tous univers.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A travers mon expérience, j'ai appris de très nombreuses techniques liées à des styles qui m'ont inspiré, comme League of Legends, Valorant ou Magic. Aujourd'hui ma mission est de transmettre ce savoir à des artistes qui partagent l'amour de l'art.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    Illustration Digitale
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Art Fantastique</span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Character Design</span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Concept Art</span>
                </div>
              </div>

              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <Image
                  src="/images/florian.png"
                  alt="Bobe Florian"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Bobe Florian</h3>
                  <p className="text-gray-300">Illustrateur Professionnel</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <div id="gallery">
          <MainPortfolio />
          
          {/* Gallery Button Section */}
          <section className="py-12 px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground mb-8">
                Découvrez l'ensemble de mes créations dans ma galerie complète
              </p>
              <EnhancedSpotlightButton
                onClick={() => (window.location.href = "/gallerie")}
                className="px-0.5 py-0.5 text-lg"
              >
                Voir la Galerie
              </EnhancedSpotlightButton>
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Contactez-Moi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Contactez-Moi :</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Votre demande concerne une requête personnalisée, un projet, un devis ou n'importe quelle autre demande non présente sur le site, contactez nous.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">contact@bobeflorian.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-muted-foreground">+33 6 12 34 56 78</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Localisation</p>
                      <p className="text-muted-foreground">Paris, France</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Demande de Devis</CardTitle>
                  <CardDescription>Décrivez votre projet et recevez une estimation personnalisée</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom complet</label>
                    <input
                      id="fullName"
                      type="text"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de projet</label>
                    <select
                      id="projectType"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Commission personnalisée</option>
                      <option>Coaching artistique</option>
                      <option>Achat d'œuvres</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description du projet</label>
                    <textarea
                      id="projectDescription"
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Décrivez votre projet en détail..."
                    />
                  </div>

                  <EnhancedSpotlightButton className="w-full" onClick={handleSendRequest}>
                    Envoyer la Demande
                  </EnhancedSpotlightButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
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
                  <button onClick={() => scrollToSection("retours")} className="hover:text-primary transition-colors">
                    Avis
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">
                    Portfolio
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/gallerie"} className="hover:text-primary transition-colors">
                    Galerie
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("coaching")} className="hover:text-primary transition-colors">
                    Coaching
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("commissions")}
                    className="hover:text-primary transition-colors"
                  >
                    Commissions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("print-shop")}
                    className="hover:text-primary transition-colors"
                  >
                    Print Shop
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("ebooks")} className="hover:text-primary transition-colors">
                    E-books
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">
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