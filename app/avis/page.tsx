"use client"
import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Home, User, Briefcase, ImageIcon, Mail, Users, ShoppingBag, BookOpen, Filter, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavBar } from "@/components/ui/tubelight-navbar"

const reviews = [
  {
    name: "📢 Annonce Spéciale",
    avatar: "/images/logo.png",
    rating: 5,
    comment: "🎌 Je serai à la Japan Touch 2025 ! Venez me rencontrer lors de cet événement incontournable de la culture japonaise. Une occasion unique de découvrir mes œuvres en personne et d'échanger autour de l'art manga et anime. Restez connectés pour plus d'informations sur mon stand ! 🎨✨",
    type: "announcement",
    artworkImage: "/images/artwork-1.jpg"
  },
  {
    name: "BAM",
    avatar: "/bam.png",
    rating: 5,
    comment: "Les cours de Florian, c'est l'assurance de progresser dans une ambiance à la fois chaleureuse et motivant ! Proche de ses élèves, il explique avec clarté et donne des conseils personnalisés sur nos créations, toujours pertinents et utiles pour avancer. Chaque séance est un vrai moment d'échange, avec des retours constructifs qui boostent notre motivation. L'excellente entente entre les élèves crée une dynamique de groupe où l'on s'encourage et se pousse mutuellement à progresser ! après ca... vous ne pouvez que nous rejoindre ! PS : Végéta est Algérien",
    type: "coaching",
    artworkImage: "/images/shanks.jpg"
  },
  {
    name: "Ramazan 𒉭",
    avatar: "/ramazan.png",
    rating: 5,
    comment: "Les cours de Florian sont une mine d'or d'informations et de connaissances que l'on ne peut acquérir seul ou en regardant simplement des vidéos sur YouTube. De plus, il explique et corrige vos dessins en vous apportant des explications et les points à améliorer. Que vous soyez complet ou d'un niveau de dessins plus avancé, Florian s'adapte en fonction de chacun, en expliquant les bases pour les débutants et des conseils plus avancés et approfondis pour les dessinateurs avancés, franchement, pour le prix des cours de Floriant C'est vraiment plus que rentable pour vous qu'une école de dessin à 9k l'année, vous avez deux cours par semaine, avec des devoirs à faire hors des cours. N'hésitez pas à vous joindre à nous !",
    type: "coaching"
  },
  {
    name: "Zizou",
    avatar: "/zizou.png",
    rating: 5,
    comment: "Commande reçue rapidement et la qualité d'impression est parfaite. Les couleurs sont grave quali !",
    type: "print"
  },
  {
    name: "Kerem Erdinc",
    avatar: "/kerem.png",
    rating: 5,
    comment: "Wow, I am blown away by the final result! Amazing work!! I love that slight gradient effect you put on the wings and glowing arm to add unique texture, I don't think I've ever seen that before. While he's a very loud character in look and style there's a certain subdued subtlety to both pieces that I really goes well with the whole duality theme I wanted to shoot for. I love the shading differences in the black and white version too, people will be able to tell I didn't just lower the saturation on the first image. Couldn't be happier with both pieces! Feel free to send those drive links and I'll get these to my printer. Thank you again, and I definitely look forward to commissioning more art from you in the future. 🙏",
    type: "commission",
    artworkImage: "/images/artwork-1.jpg"
  },
  {
    name: "Jins",
    avatar: "/jins.png",
    rating: 5,
    comment: "C'est monstrueux, vraiment. Merci beaucoup ! C'est Incroyable",
    type: "commission",
    artworkImage: "/commi.png"
  },
  {
    name: "Tina",
    avatar: "/user.jpg", 
    rating: 5,
    comment: "Thank you she is so pretty and cool!",
    type: "commission",
    artworkImage: "/tina.png"
  }
]

export default function AvisPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("avis")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const navItems = [
    { name: "Accueil", url: "/#accueil", icon: Home },
    { name: "Avis", url: "/#retours", icon: Mail },
    { name: "Portfolio", url: "/#about", icon: User },
    { name: "Services", url: "/services", icon: Briefcase },
    { name: "Galerie", url: "/gallerie", icon: ImageIcon },
    { name: "Contact", url: "/#contact", icon: Mail },
    { name: "Print Shop", url: "/shop", icon: ShoppingBag },
  ]

  useEffect(() => {
    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const filteredReviews = reviews.filter(review => 
    selectedFilter === "all" || review.type === selectedFilter
  )

  const getFilterLabel = (type: string) => {
    switch(type) {
      case "all": return "Tous les avis"
      case "coaching": return "Coaching"
      case "commission": return "Commissions"
      case "print": return "Print Shop"
      case "announcement": return "Annonces"
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case "coaching": return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)' }
      case "print": return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' }
      case "announcement": return { color: '#ff6b6b', bg: 'rgba(255, 107, 107, 0.2)' }
      case "commission": return { color: '#c3b383', bg: 'rgba(195, 179, 131, 0.2)' }
      default: return { color: '#c3b383', bg: 'rgba(195, 179, 131, 0.2)' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "coaching": return "✧ Coaching"
      case "print": return "Print Shop"
      case "announcement": return "🎌 Annonce"
      case "commission": return "Commission"
      default: return "Service"
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
        {/* Header */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/prints/25_05_10_Zoro.png"
              alt="Zoro Background"
              fill
              className="object-cover opacity-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
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
              Tous les Avis
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez les retours de mes clients sur mes différents services
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 justify-center mb-8">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrer par service :</span>
              {["all", "coaching", "commission", "print", "announcement"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                    selectedFilter === filter
                      ? "bg-primary/20 text-primary border-primary/50"
                      : "bg-card/50 text-muted-foreground border-border hover:bg-card hover:text-foreground"
                  }`}
                >
                  {getFilterLabel(filter)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-8 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredReviews.map((review, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Commission with artwork layout */}
                    {review.type === "commission" && review.artworkImage ? (
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Artwork Image */}
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={review.artworkImage}
                            alt={`Commission artwork for ${review.name}`}
                            fill
                            className="object-cover scale-105"
                          />
                        </div>
                        
                        {/* Review Content */}
                        <div className="p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                              <AvatarFallback>
                                {review.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm">{review.name}</h3>
                              <div className="flex gap-1 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3" style={{ 
                                    fill: i < review.rating ? '#f4e6d0' : 'transparent', 
                                    color: '#f4e6d0' 
                                  }} />
                                ))}
                              </div>
                              <span 
                                className="text-xs px-2 py-1 rounded-full" 
                                style={getTypeColor(review.type)}
                              >
                                {getTypeIcon(review.type)}
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm italic leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Regular review layout */
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                            <AvatarFallback>
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{review.name}</h3>
                            <div className="flex gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4" style={{ 
                                  fill: i < review.rating ? '#f4e6d0' : 'transparent', 
                                  color: '#f4e6d0' 
                                }} />
                              ))}
                            </div>
                            <span 
                              className="text-xs px-2 py-1 rounded-full" 
                              style={getTypeColor(review.type)}
                            >
                              {getTypeIcon(review.type)}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  <a href="/#about" className="hover:text-primary transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="/gallerie" className="hover:text-primary transition-colors">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-primary transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/shop" className="hover:text-primary transition-colors">
                    Print Shop
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="hover:text-primary transition-colors">
                    Contact
                  </a>
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
                    className="hover:text-primary transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@bobe_florian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
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