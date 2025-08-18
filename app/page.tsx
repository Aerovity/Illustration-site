"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Palette,
  Users,
  ShoppingBag,
  Youtube,
  ExternalLink,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { FAQSection } from "@/components/faq-section"
import { ArtworkGallery } from "@/components/artwork-gallery"
import { CommissionForm } from "@/components/commission-form"

// Hero Background Component with auto-switching between image and video
function HeroBackground({ showVideo, onVideoEnd }: { showVideo: boolean; onVideoEnd: () => void }) {
  return (
    <div className="absolute inset-0 z-0">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-top opacity-40"
          style={{ objectPosition: "center 20%" }}
          priority
        />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
        <video
          autoPlay
          muted
          className="w-full h-full object-cover object-top opacity-60"
          style={{ objectPosition: "center 20%" }}
          onEnded={onVideoEnd}
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
    <div className={`absolute inset-0 z-20 transition-all duration-1000 ${
      showVideo 
        ? 'bg-gradient-to-b from-background/30 via-background/20 to-background/80' 
        : 'bg-gradient-to-b from-background/60 via-background/40 to-background'
    }`} />
  )
}

// Hero Content Component with dynamic transparency
function HeroContent({ showVideo, switchView, scrollToSection }: { 
  showVideo: boolean; 
  switchView: (view: "accueil" | "services") => void;
  scrollToSection: (section: string) => void;
}) {
  return (
    <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
      <div className={`transition-opacity duration-1000 ${
        showVideo ? 'opacity-30' : 'opacity-100'
      }`}>
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
      <div className={`flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300 transition-opacity duration-1000 ${
        showVideo ? 'opacity-50' : 'opacity-100'
      }`}>
        <EnhancedSpotlightButton
          onClick={() => scrollToSection("coaching")}
          focusRingColor="golden"
          gradientColor="golden"
          sparkles={true}
          className="px-0.5 py-0.5 text-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-500/25"
        >
          Coaching Pro ✧
        </EnhancedSpotlightButton>
        <EnhancedSpotlightButton onClick={() => switchView("services")} className="px-0.5 py-0.5 text-lg">
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
    </div>
  )
}

// Combined Hero Section Component
function HeroSection({ switchView, scrollToSection }: {
  switchView: (view: "accueil" | "services") => void;
  scrollToSection: (section: string) => void;
}) {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    // Start with image for 3 seconds, then switch to video
    const startCycle = () => {
      // Show image for 3 seconds
      setShowVideo(false)
      setTimeout(() => {
        // Then show video (it will play to completion)
        setShowVideo(true)
      }, 3000)
    }

    // Start the initial cycle
    startCycle()
  }, [])

  const handleVideoEnd = () => {
    // When video ends, show image for 3 seconds, then restart cycle
    setShowVideo(false)
    setTimeout(() => {
      setShowVideo(true)
    }, 3000)
  }

  return (
    <>
      <HeroBackground showVideo={showVideo} onVideoEnd={handleVideoEnd} />
      <HeroOverlay showVideo={showVideo} />
      <HeroContent showVideo={showVideo} switchView={switchView} scrollToSection={scrollToSection} />
    </>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")
  const [currentView, setCurrentView] = useState<"accueil" | "services">("accueil")
  const [showSubsections, setShowSubsections] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false)

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
      const sections = currentView === "accueil" 
        ? ["accueil", "about", "portfolio", "gallery", "contact"]
        : ["coaching", "commissions", "print-shop", "ebooks"]
      
      let current = sections[0]
      let closestSection = ""
      let closestDistance = Infinity
      
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
  }, [currentView])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
  }

  const switchView = (view: "accueil" | "services") => {
    if (currentView === view) {
      // If same view is clicked, just scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    
    setCurrentView(view)
    setActiveSection(view === "accueil" ? "accueil" : "coaching")
    setShowSubsections(false)
    
    // Animate subsection appearance after view change
    setTimeout(() => {
      setShowSubsections(true)
    }, 150)
    
    // Scroll to top when switching views
    window.scrollTo({ top: 0, behavior: "smooth" })
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
    
    window.open(mailtoLink, '_blank')
  }

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

      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/images/logo.png" alt="Bobe Florian Logo" width={200} height={60} className="h-16 w-auto" />
            </div>

            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => switchView("accueil")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    currentView === "accueil" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Accueil
                </button>
                
                {/* Accueil Subsections - appear between Accueil and Services */}
                {currentView === "accueil" && (
                  <div className={`flex items-center space-x-4 transition-all duration-300 ${
                    showSubsections ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <div className="w-px h-4 bg-border/50"></div>
                    <button
                      onClick={() => scrollToSection("about")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "about" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      À propos
                    </button>
                    <button
                      onClick={() => scrollToSection("portfolio")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "portfolio" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Portfolio
                    </button>
                    <button
                      onClick={() => scrollToSection("gallery")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "gallery" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Galerie
                    </button>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "contact" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Contact
                    </button>
                    <div className="w-px h-4 bg-border/50"></div>
                  </div>
                )}

                <button
                  onClick={() => switchView("services")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    currentView === "services" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Services
                </button>
                
                {/* Services Subsections - appear after Services */}
                {currentView === "services" && (
                  <div className={`flex items-center space-x-4 transition-all duration-300 ${
                    showSubsections ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <div className="w-px h-4 bg-border/50"></div>
                    <button
                      onClick={() => scrollToSection("coaching")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "coaching" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Coaching Pro
                    </button>
                    <button
                      onClick={() => scrollToSection("commissions")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "commissions" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Commissions
                    </button>
                    <button
                      onClick={() => window.location.href = "/shop"}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "print-shop" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      Print Shop
                    </button>
                    <button
                      onClick={() => scrollToSection("ebooks")}
                      className={`text-xs font-medium transition-colors ${
                        activeSection === "ebooks" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      E-books
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50">
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-2">
                <button 
                  onClick={() => switchView("accueil")} 
                  className={`block text-sm font-medium ${currentView === "accueil" ? "text-primary" : "hover:text-primary"}`}
                >
                  Accueil
                </button>
                {currentView === "accueil" && (
                  <div className="pl-4 space-y-1">
                    <button onClick={() => scrollToSection("about")} className="block text-sm hover:text-primary">
                      À propos
                    </button>
                    <button onClick={() => scrollToSection("portfolio")} className="block text-sm hover:text-primary">
                      Portfolio / Ressources
                    </button>
                    <button onClick={() => scrollToSection("gallery")} className="block text-sm hover:text-primary">
                      Galerie
                    </button>
                    <button onClick={() => scrollToSection("contact")} className="block text-sm hover:text-primary">
                      Contact
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={() => switchView("services")} 
                  className={`block text-sm font-medium ${currentView === "services" ? "text-primary" : "hover:text-primary"}`}
                >
                  Services
                </button>
                {currentView === "services" && (
                  <div className="pl-4 space-y-1">
                    <button onClick={() => scrollToSection("coaching")} className="block text-sm hover:text-primary">
                      Coaching Pro
                    </button>
                    <button onClick={() => scrollToSection("commissions")} className="block text-sm hover:text-primary">
                      Commissions
                    </button>
                    <button onClick={() => window.location.href = "/shop"} className="block text-sm hover:text-primary">
                      Print Shop
                    </button>
                    <button onClick={() => scrollToSection("ebooks")} className="block text-sm hover:text-primary">
                      E-books & Tutos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content based on current view */}
      <div className="pt-16">
        {currentView === "accueil" ? (
          <>
            {/* Hero Section */}
            <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
              <HeroSection switchView={switchView} scrollToSection={scrollToSection} />
            </section>

            <section id="about" className="py-20 px-4 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      À Propos de Moi
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Passionné par l'art depuis mon plus jeune âge, je me spécialise dans la création d'illustrations
                      Splash art inspirées des univers Manga/Anime/Gaming . Mon style unique
                      mélange techniques traditionnelles et art numérique.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Avec plus de 15 ans d'expérience, j'ai eu le privilège de travailler avec des clients du monde
                      entier, créant des personnages mémorables, des illustrations captivantes et des concepts
                      artistiques pour diverses industries.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        Illustration Digitale
                      </span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Art Fantastique</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        Character Design
                      </span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Concept Art</span>
                    </div>
                  </div>

                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                    <Image
                      src="/images/profile.jpg"
                      alt="Bobe Florian Portrait - Sasuke Artwork"
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

            {/* Portfolio / Ressources Section */}
            <section id="portfolio" className="py-20 px-4 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Portfolio / Ressources
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                    Découvrez mon processus créatif et mes techniques à travers cette vidéo exclusive. Contenu gratuit, articles, et études de cas pour développer votre crédibilité artistique.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                    <iframe
                      src="https://www.youtube.com/embed/xMXUyqvFTQk?start=342"
                      title="Portfolio Ressources Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-2xl"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">Ressources Gratuites</h3>
                    <div className="space-y-4">
                      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Articles & Tutoriels</h4>
                          <p className="text-sm text-muted-foreground">
                            Techniques avancées, conseils professionnels et études de cas détaillées
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Processus Créatifs</h4>
                          <p className="text-sm text-muted-foreground">
                            Découvrez les étapes de création de mes illustrations les plus populaires
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Études de Cas</h4>
                          <p className="text-sm text-muted-foreground">
                            Analyses détaillées de projets clients et retours d'expérience
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Artwork Gallery */}
            <div id="gallery">
              <ArtworkGallery />
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
                      <h3 className="text-2xl font-semibold mb-6">Parlons de Votre Projet</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Que vous ayez besoin d'une illustration personnalisée, de coaching artistique ou d'œuvres d'art
                        pour votre collection, je suis là pour donner vie à vos idées.
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
                        <select id="projectType" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
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

                      <EnhancedSpotlightButton className="w-full" onClick={handleSendRequest}>Envoyer la Demande</EnhancedSpotlightButton>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="relative py-20 px-4 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/services-bg.png"
                  alt="Services Background"
                  fill
                  className="object-cover opacity-70"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
                {/* Spotlight effect for banner - reduced intensity */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={
                    {
                      background: `radial-gradient(
                        circle at ${isClient ? `${(mousePosition.x / window.innerWidth) * 100}%` : "50%"} ${isClient ? `${(mousePosition.y / window.innerHeight) * 100}%` : "50%"},
                        rgba(139, 92, 246, 0.08) 0%,
                        rgba(139, 92, 246, 0.03) 25%,
                        transparent 50%
                      )`
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mes Services
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Des solutions créatives adaptées à tous vos besoins artistiques
                </p>
              </div>
            </section>

            {/* Coaching Section */}
            <section id="coaching" className="py-20 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
                    <span className="text-3xl">✧</span>
                    Coaching Pro
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                    Développez vos compétences artistiques avec un accompagnement personnalisé. Choisissez votre format de cours.
                  </p>
                  <p className="text-xl font-medium text-primary">Choisissez votre abonnement</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Cours Collectif Card */}
                  <div className="flex flex-col space-y-6">
                    <Card className="bg-card/30 backdrop-blur-sm border-border/50 relative flex-1 flex flex-col">
                      <div className="absolute top-4 right-4 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">
                        10 places restantes
                      </div>
                      <CardHeader className="flex-1">
                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Cours Collectif</CardTitle>
                        <div className="space-y-4">
                          <div className="border border-primary/50 rounded-lg p-4 bg-primary/5 relative">
                            <div className="absolute -top-2 left-4 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                              Most popular
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">Feedbacker</div>
                            <div className="text-2xl font-bold text-primary mb-2">48€ / mois</div>
                            <div className="text-xs text-muted-foreground mb-4">(plus VAT)</div>
                            <p className="text-center text-xs text-muted-foreground mb-2">
                              ou vous pouvez commander ici : {" "}
                              <a 
                                href="https://www.patreon.com/bobe_florian" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Patreon
                              </a>
                            </p>
                            <EnhancedSpotlightButton className="w-full mb-4" disabled>
                              Sold Out
                            </EnhancedSpotlightButton>
                            <div className="text-xs text-red-400 mb-4">Limited spaces - SOLD OUT</div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Merci du fond du cœur ❤️
                            </p>
                            <div className="space-y-2 text-sm mb-4">
                              <p>✅ Tous les avantages des tiers précédents</p>
                              <p>✅ Accès VIP à mon serveur Discord</p>
                              <p>✅ Des sessions de feedback en direct : 4h/semaine !</p>
                              <p>✅ Votez pour la prochaine idée de vidéo !</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg text-sm">
                              <p className="font-medium mb-2">📅 Horaires des sessions :</p>
                              <p>🗓 Lundi et jeudi de 18h à 20h (sur Discord)</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                    
                    {/* Image for Feedbacker */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                      <Image
                        src="/images/22_Gojo.jpg"
                        alt="Feedbacker - Gojo"
                        fill
                        className="object-cover"
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </div>

                  {/* Cours Solo Card */}
                  <div className="flex flex-col space-y-6">
                    <Card className="bg-card/30 backdrop-blur-sm border-border/50 flex-1 flex flex-col">
                      <CardHeader>
                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Cours Privé</CardTitle>
                        <CardDescription className="text-lg">
                          Accompagnement personnalisé pour une progression optimale
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                            <span className="font-medium">Session 1h</span>
                            <span className="font-bold text-primary">60€</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                            <span className="font-medium">Pack 6 sessions</span>
                            <span className="font-bold text-primary">450€</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                            <span className="font-medium">Mentorat mensuel</span>
                            <span className="font-bold text-primary">600€/mois</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-8 text-sm">
                          <p>✅ Record session</p>
                          <p>✅ Programme personnalisé</p>
                          <p>✅ Exercices sur-mesure</p>
                          <p>✅ Orientation clé : point fort/faible</p>
                          <p>✅ Préparation workspace et mindset</p>
                          <p>✅ Compte rendu et axe amélioratif</p>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mb-4">
                          ou vous pouvez commander ici : {" "}
                          <a 
                            href="https://www.patreon.com/bobe_florian" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Coaching
                          </a>
                        </p>

                        <EnhancedSpotlightButton
                          className="w-full py-0.5 text-lg mt-auto"
                          onClick={() => window.open("https://www.patreon.com/bobe_florian", "_blank")}
                        >
                          Réserver une Session
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </EnhancedSpotlightButton>
                      </CardContent>
                    </Card>
                    
                    {/* Image for Cours Privé */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                      <Image
                        src="/images/demon-warrior.jpg"
                        alt="Cours Privé - Demon Warrior"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Commissions Section */}
            <section id="commissions" className="py-20 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative aspect-square lg:aspect-auto">
                      <Image src="/images/shanks.jpg" alt="Commission Artwork - Shanks" fill className="object-cover" />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                        <Palette className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Commissions
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Transformez vos idées en œuvres d'art uniques. Que ce soit pour un personnage original, une
                        couverture de livre ou un concept artistique, je donne vie à votre vision avec un style
                        distinctif et une attention aux détails exceptionnelle.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Portrait Simple</span>
                          <span className="font-bold text-primary">150€ - 250€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Illustration Complète</span>
                          <span className="font-bold text-primary">300€ - 600€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Concept Art</span>
                          <span className="font-bold text-primary">400€ - 800€</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <p>✓ Haute résolution (300 DPI)</p>
                          <p>✓ 2-3 révisions incluses</p>
                        </div>
                        <div className="space-y-2">
                          <p>✓ Formats multiples</p>
                          <p>✓ Délai : 1-4 semaines</p>
                        </div>
                      </div>

                      <p className="text-center text-sm text-muted-foreground mb-4">
                        ou vous pouvez commander ici : {" "}
                        <a 
                          href="https://artistree.io/bobeflorian" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Commissions
                        </a>
                      </p>

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        onClick={() => setIsCommissionFormOpen(true)}
                      >
                        Commander une Commission
                      </EnhancedSpotlightButton>
                    </div>
                  </div>
                </Card>
              </div>
            </section>



            {/* E-books & Tutos Section */}
            <section id="ebooks" className="py-20 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                        <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        E-books & Tutos
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Ressources numériques complètes : PDF détaillés, vidéos de formation et cours premium pour approfondir vos connaissances artistiques. Bientôt disponible !
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Guides PDF</span>
                          <span className="font-bold text-primary">15€ - 25€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Vidéos Formation</span>
                          <span className="font-bold text-primary">30€ - 50€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Cours Premium</span>
                          <span className="font-bold text-primary">80€ - 120€</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <p>✓ Techniques avancées</p>
                          <p>✓ Processus détaillés</p>
                        </div>
                        <div className="space-y-2">
                          <p>✓ Ressources exclusives</p>
                          <p>✓ Support inclus</p>
                        </div>
                      </div>

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        disabled
                      >
                        Bientôt Disponible
                      </EnhancedSpotlightButton>
                    </div>
                    <div className="relative aspect-square lg:aspect-auto">
                      <Image src="/prints/22_All_Might.jpg" alt="E-books & Tutos - All Might" fill className="object-cover" />
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Print Shop Section */}
            <section id="print-shop" className="py-20 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative aspect-square lg:aspect-auto">
                      <Image
                        src="/images/soccer-team.jpg"
                        alt="Print Shop Artwork - Soccer Team"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Print Shop
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Découvrez ma collection d'œuvres d'art imprimées en haute qualité. Chaque print est
                        soigneusement produit avec des matériaux premium pour préserver la beauté et l'intensité des
                        couleurs originales.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Print A4</span>
                          <span className="font-bold text-primary">10€ - 15€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Print A3</span>
                          <span className="font-bold text-primary">25€ - 45€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Canvas Premium</span>
                          <span className="font-bold text-primary">120€+</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <p>✓ Papier premium</p>
                          <p>✓ Encres archivales</p>
                        </div>
                        <div className="space-y-2">
                          <p>✓ Éditions limitées</p>
                          <p>✓ Livraison mondiale</p>
                        </div>
                      </div>

                      <p className="text-center text-sm text-muted-foreground mb-4">
                        ou vous pouvez commander ici : {" "}
                        <a 
                          href="https://www.etsy.com/shop/BobeFlorian" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Print Shop
                        </a>
                      </p>

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        onClick={() => window.location.href = "/shop"}
                      >
                        Visiter la Boutique
                      </EnhancedSpotlightButton>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </>
        )}
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
                  <button onClick={() => switchView("accueil")} className="hover:text-primary transition-colors">
                    Accueil
                  </button>
                </li>
                <li>
                  <button onClick={() => switchView("services")} className="hover:text-primary transition-colors">
                    Services
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

      {/* Commission Form Modal */}
      <CommissionForm 
        isOpen={isCommissionFormOpen} 
        onClose={() => setIsCommissionFormOpen(false)} 
      />
    </div>
  )
}
