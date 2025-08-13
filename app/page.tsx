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
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { FAQSection } from "@/components/faq-section"
import { ArtworkGallery } from "@/components/artwork-gallery"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")
  const [currentView, setCurrentView] = useState<"about" | "services">("about")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

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
      const sections = currentView === "about" 
        ? ["accueil", "reviews", "faq", "contact"]
        : ["commissions", "coaching", "print-shop"]
      
      let current = sections[0]
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Consider a section active if it's at least 50% visible
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = sectionId
            break
          }
        }
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

  const switchView = (view: "about" | "services") => {
    setCurrentView(view)
    setActiveSection(view === "about" ? "accueil" : "commissions")
    // Scroll to top when switching views
    window.scrollTo({ top: 0, behavior: "smooth" })
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

      <div className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-8">
            <div className="flex bg-card/50 backdrop-blur-sm rounded-full p-0.5 border border-border/50">
              <button
                onClick={() => switchView("about")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  currentView === "about"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                About
              </button>
              <button
                onClick={() => switchView("services")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  currentView === "services"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Produits et Services
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="fixed top-8 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/images/logo.png" alt="Bobe Florian Logo" width={160} height={50} className="h-12 w-auto" />
            </div>

            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              {currentView === "about" ? (
                <div className="flex space-x-8">
                  <button
                    onClick={() => scrollToSection("accueil")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "accueil" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Accueil
                  </button>
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "reviews" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "faq" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    FAQ
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "contact" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Contact
                  </button>
                </div>
              ) : (
                <div className="flex space-x-8">
                  <button
                    onClick={() => scrollToSection("commissions")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "commissions" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Commissions
                  </button>
                  <button
                    onClick={() => scrollToSection("coaching")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "coaching" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Coaching
                  </button>
                  <button
                    onClick={() => scrollToSection("print-shop")}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === "print-shop" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Print Shop
                  </button>
                </div>
              )}
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
              {currentView === "about" ? (
                <div className="space-y-2">
                  <button onClick={() => scrollToSection("accueil")} className="block text-sm hover:text-primary">
                    Accueil
                  </button>
                  <button onClick={() => scrollToSection("reviews")} className="block text-sm hover:text-primary">
                    Reviews
                  </button>
                  <button onClick={() => scrollToSection("faq")} className="block text-sm hover:text-primary">
                    FAQ
                  </button>
                  <button onClick={() => scrollToSection("contact")} className="block text-sm hover:text-primary">
                    Contact
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => scrollToSection("commissions")} className="block text-sm hover:text-primary">
                    Commissions
                  </button>
                  <button onClick={() => scrollToSection("coaching")} className="block text-sm hover:text-primary">
                    Coaching
                  </button>
                  <button onClick={() => scrollToSection("print-shop")} className="block text-sm hover:text-primary">
                    Print Shop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Content based on current view */}
      <div className="pt-24">
        {currentView === "about" ? (
          <>
            {/* Hero Section */}
            <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Hero Background"
                  fill
                  className="object-cover object-top opacity-40"
                  style={{ objectPosition: "center 20%" }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
              </div>

              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
                  Bobe Florian
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animate-delay-100">
                  Artiste Illustrateur • Créateur d'Illustrations
                </p>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                  Donnez vie à vos rêves et vos histoires à travers des illustrations uniques . Croissant Illustrator
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
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
            </section>

            <section className="py-20 px-4 relative z-10">
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

            {/* Artwork Gallery */}
            <ArtworkGallery />

            {/* Reviews Section */}
            <div id="reviews">
              <ReviewsCarousel />
            </div>

            {/* FAQ Section */}
            <div id="faq">
              <FAQSection />
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
                          type="text"
                          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type de projet</label>
                        <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>Commission personnalisée</option>
                          <option>Coaching artistique</option>
                          <option>Achat d'œuvres</option>
                          <option>Autre</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description du projet</label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          placeholder="Décrivez votre projet en détail..."
                        />
                      </div>

                      <EnhancedSpotlightButton className="w-full">Envoyer la Demande</EnhancedSpotlightButton>
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

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        onClick={() => window.open("https://artistree.io/bobeflorian", "_blank")}
                      >
                        Commander une Commission
                        <ExternalLink className="ml-0.5 h-0.5 w-" />
                      </EnhancedSpotlightButton>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Coaching Section */}
            <section id="coaching" className="py-20 px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Coaching
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Développez vos compétences artistiques avec un accompagnement personnalisé. Apprenez les
                        techniques professionnelles, perfectionnez votre style et accélérez votre progression grâce à
                        des conseils d'expert.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Session 1h</span>
                          <span className="font-bold text-primary">80€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Pack 5 sessions</span>
                          <span className="font-bold text-primary">350€</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">Mentorat mensuel</span>
                          <span className="font-bold text-primary">200€/mois</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <p>✓ Techniques avancées</p>
                          <p>✓ Feedback personnalisé</p>
                        </div>
                        <div className="space-y-2">
                          <p>✓ Ressources exclusives</p>
                          <p>✓ Support continu</p>
                        </div>
                      </div>

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        onClick={() => window.open("https://www.patreon.com/bobe_florian", "_blank")}
                      >
                        Réserver une Session
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </EnhancedSpotlightButton>
                    </div>
                    <div className="relative aspect-square lg:aspect-auto order-1 lg:order-2">
                      <Image
                        src="/images/demon-warrior.jpg"
                        alt="Coaching Artwork - Demon Warrior"
                        fill
                        className="object-cover"
                      />
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

                      <EnhancedSpotlightButton
                        className="w-full py-0.5 text-lg"
                        onClick={() => window.open("https://www.etsy.com/shop/BobeFlorian", "_blank")}
                      >
                        Visiter la Boutique
                        <ExternalLink className="ml-2 h-4 w-4" />
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
                  <button onClick={() => switchView("about")} className="hover:text-primary transition-colors">
                    About
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
    </div>
  )
}
