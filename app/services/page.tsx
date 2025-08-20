"use client"
import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, User, Briefcase, ImageIcon, Mail, Palette, Users, ShoppingBag, BookOpen, Instagram, Twitter, Youtube } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { CommissionForm } from "@/components/commission-form"
import { CoachingForm } from "@/components/coaching-form"
import { NavBar } from "@/components/ui/tubelight-navbar"

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("coaching")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false)
  const [isCoachingFormOpen, setIsCoachingFormOpen] = useState(false)

  const navItems = [
    { name: "Accueil", url: "/#accueil", icon: Home },
    { name: "À propos", url: "/#about", icon: User },
    { name: "Avis", url: "/#retours", icon: Mail },
    { name: "Portfolio", url: "/gallerie", icon: ImageIcon },
    { name: "Contact", url: "/#contact", icon: Mail },
    { name: "Coaching", url: "#coaching", icon: Users },
    { name: "Commissions", url: "#commissions", icon: Palette },
    { name: "Print Shop", url: "/shop", icon: ShoppingBag },
    { name: "E-books", url: "#ebooks", icon: BookOpen },
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
      const sections = ["coaching", "commissions", "print-shop", "ebooks"]

      let current = sections[0]
      let closestSection = ""
      let closestDistance = Number.POSITIVE_INFINITY

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const distanceFromTop = Math.abs(rect.top)

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
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (
      sectionId === "accueil" ||
      sectionId === "about" ||
      sectionId === "portfolio" ||
      sectionId === "gallery" ||
      sectionId === "contact"
    ) {
      // Navigate to main page for these sections
      window.location.href = `/#${sectionId}`
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
    }
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

      <NavBar items={navItems} activeSection={activeSection} />

      {/* Content */}
      <div className="pt-16">
        {/* Services Banner */}
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
            <div
              className="absolute inset-0 pointer-events-none"
              style={
                {
                  background: `radial-gradient(
                    circle at ${isClient ? `${(mousePosition.x / window.innerWidth) * 100}%` : "50%"} ${isClient ? `${(mousePosition.y / window.innerHeight) * 100}%` : "50%"},
                    rgba(139, 92, 246, 0.08) 0%,
                    rgba(139, 92, 246, 0.03) 25%,
                    transparent 50%
                  )`,
                } as React.CSSProperties
              }
            />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mes Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Vous souhaitez prendre des cours personnalisés avec moi ou rejoindre mes classes collectifs ? Vous êtes au
              bon endroit.
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
                Développez vos compétences artistiques avec un accompagnement personnalisé. Choisissez votre format de
                cours.
              </p>
              <p className="text-xl font-medium text-primary">Choisissez votre abonnement</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cours Collectif Card */}
              <div className="flex flex-col">
                <div className="relative flex-1 flex flex-col overflow-hidden rounded-2xl p-[2px]" style={{
                  animation: 'silverSparkle 3s ease-in-out infinite'
                }}>
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c0c0c0_0%,#e8e8e8_25%,#c0c0c0_50%,#f5f5f5_75%,#c0c0c0_100%)]" />
                <Card className="bg-card backdrop-blur-sm relative flex-1 flex flex-col rounded-2xl border-0" style={{
                  boxShadow: '0 0 20px rgba(192, 192, 192, 0.3)'
                }}>
                  <div className="absolute top-4 right-4 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">
                    5 places restantes
                  </div>
                  <CardHeader className="flex-1">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">Cours Collectif ✨</CardTitle>
                    <p className="text-sm text-muted-foreground italic mb-4">sans engagement !</p>
                    <div className="space-y-4">
                      <div className="border border-primary/50 rounded-lg p-4 bg-primary/5 relative">
                        <div className="absolute -top-2 left-4 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          Most popular
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">Feedbacker</div>
                        <div className="text-2xl font-bold text-primary mb-2">48€ / mois</div>
                        <div className="text-xs text-muted-foreground mb-4">(plus VAT)</div>
                        <p className="text-center text-xs text-muted-foreground mb-2">
                          ou vous pouvez commander ici :{" "}
                          <a
                            href="https://www.patreon.com/bobe_florian"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Patreon
                          </a>
                        </p>
                        <EnhancedSpotlightButton 
                          className="w-full px-0.5 py-0.5 text-lg mb-4" 
                          focusRingColor="silver" 
                          gradientColor="silver"
                          onClick={() => window.open('https://www.patreon.com/bobe_florian', '_blank')}
                        >
                          Participer aux Cours
                        </EnhancedSpotlightButton>
                        <div className="text-xs text-green-400 mb-4">Places disponibles - Rejoignez-nous!</div>
                        <p className="text-sm text-muted-foreground mb-4">Merci du fond du cœur ❤️</p>
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

                    {/* Image for Feedbacker - Inside Card */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl mt-4">
                      <Image
                        src="/prints/24_09_Dungeon_Meshi.jpg"
                        alt="Feedbacker - Dungeon Meshi"
                        fill
                        className="object-cover"
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </CardHeader>
                </Card>
                </div>
              </div>

              {/* Cours Solo Card */}
              <div className="flex flex-col">
                <div className="relative flex-1 flex flex-col overflow-hidden rounded-2xl p-[3px]" style={{
                  animation: 'goldenSparkle 2.5s ease-in-out infinite'
                }}>
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffd700_0%,#ffed4e_25%,#ffd700_50%,#fff59d_75%,#ffd700_100%)]" />
                <Card className="bg-card backdrop-blur-sm flex-1 flex flex-col relative rounded-2xl border-0" style={{
                  boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)'
                }}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-yellow-400" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">Cours Privé ✧</CardTitle>
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
                      ou vous pouvez commander ici :{" "}
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
                      className="w-full px-0.5 py-0.5 text-lg mb-4"
                      onClick={() => setIsCoachingFormOpen(true)}
                      focusRingColor="golden"
                      gradientColor="golden"
                      sparkles
                    >
                      Réserver une Session
                    </EnhancedSpotlightButton>

                    {/* Image for Cours Privé - Inside Card */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                      <Image
                        src="/images/demon-warrior.jpg"
                        alt="Cours Privé - Demon Warrior"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Moving Sparkles for Premium Effect */}
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
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Commissions Section */}
        <section id="commissions" className="py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-card backdrop-blur-sm border-border/50 overflow-hidden">
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
                    couverture de livre ou un concept artistique, je donne vie à votre vision avec un style distinctif
                    et une attention aux détails exceptionnelle.
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
                    ou vous pouvez commander ici :{" "}
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
            <Card className="bg-card backdrop-blur-sm border-border/50 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    E-books & Tutos
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Ressources numériques complètes : PDF détaillés, vidéos de formation et cours premium pour
                    approfondir vos connaissances artistiques. Bientôt disponible !
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

                  <EnhancedSpotlightButton className="w-full py-0.5 text-lg" disabled>
                    Bientôt Disponible
                  </EnhancedSpotlightButton>
                </div>
                <div className="relative aspect-square lg:aspect-auto">
                  <Image
                    src="/prints/22_All_Might.jpg"
                    alt="E-books & Tutos - All Might"
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
            <Card className="bg-card backdrop-blur-sm border-border/50 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative aspect-square lg:aspect-auto">
                  <Image
                    src="/images/yo.jpg"
                    alt="Print Shop Artwork - Haikyu"
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
                    Découvrez ma collection d'œuvres d'art imprimées en haute qualité. Chaque print est soigneusement
                    produit avec des matériaux premium pour préserver la beauté et l'intensité des couleurs originales.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="font-medium">Print A4</span>
                      <span className="font-bold text-primary">7€ - 12€</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="font-medium">Print A3</span>
                      <span className="font-bold text-primary">22€ - 42€</span>
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
                    ou vous pouvez commander ici :{" "}
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
                    onClick={() => (window.location.href = "/shop")}
                  >
                    Visiter la Boutique
                  </EnhancedSpotlightButton>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-card backdrop-blur-sm border-t border-border/50 py-12 px-4 relative z-10">
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
                  <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">
                    À propos
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '/gallerie'} className="hover:text-primary transition-colors">
                    Portfolio
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '/#retours'} className="hover:text-primary transition-colors">
                    Avis
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

      {/* Commission Form Modal */}
      <CommissionForm isOpen={isCommissionFormOpen} onClose={() => setIsCommissionFormOpen(false)} />

      {/* Coaching Form Modal */}
      <CoachingForm isOpen={isCoachingFormOpen} onClose={() => setIsCoachingFormOpen(false)} />
    </div>
  )
}