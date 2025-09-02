"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

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
    comment: "Wow, I am blown away by the final result! Amazing work!! I love that slight gradient effect you put on the wings and glowing arm to add unique texture, I don’t think I’ve ever seen that before. While he’s a very loud character in look and style there’s a certain subdued subtlety to both pieces that I really goes well with the whole duality theme I wanted to shoot for. I love the shading differences in the black and white version too, people will be able to tell I didn’t just lower the saturation on the first image. Couldn’t be happier with both pieces! Feel free to send those drive links and I’ll get these to my printer. Thank you again, and I definitely look forward to commissioning more art from you in the future. 🙏",
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

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    if (!autoScroll) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [autoScroll])

  // Touch gesture handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left: next review
      setCurrentIndex(prev => (prev + 1) % reviews.length)
    } else if (isRightSwipe) {
      // Swipe right: previous review
      setCurrentIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1)
    }
  }

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Avis Clients
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <EnhancedSpotlightButton
              className="px-0.5 py-0.5"
              onClick={() => window.location.href = '/avis'}
            >
              Voir tout les Avis
            </EnhancedSpotlightButton>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                autoScroll 
                  ? 'bg-primary/40' 
                  : 'bg-muted'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  autoScroll ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
              <span className="text-sm text-muted-foreground">
                Défilement automatique
              </span>
            </label>
          </div>
        </div>

        <div 
          className="relative min-h-[400px] overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 max-w-4xl mx-auto">
                  {/* Commission with artwork layout */}
                  {review.type === "commission" && review.artworkImage ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Artwork Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                        <Image
                          src={review.artworkImage}
                          alt={`Commission artwork for ${review.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Review Content */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
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
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4" style={{ fill: i < review.rating ? '#f4e6d0' : 'transparent', color: '#f4e6d0' }} />
                              ))}
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full" style={{ 
                              color: review.type === 'announcement' ? '#ff6b6b' : '#c3b383', 
                              backgroundColor: review.type === 'announcement' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(195, 179, 131, 0.2)' 
                            }}>
                              {review.type === 'announcement' ? '🎌 Annonce' : 'Commission'}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    </div>
                  ) : (
                    /* Regular review layout */
                    <div>
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
                          <div className="flex gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-4 w-4" style={{ fill: i < review.rating ? '#f4e6d0' : 'transparent', color: '#f4e6d0' }} />
                            ))}
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full" style={{
                            color: review.type === 'coaching' ? '#fbbf24' : 
                                   review.type === 'print' ? '#8b5cf6' : 
                                   review.type === 'announcement' ? '#ff6b6b' :
                                   '#c3b383',
                            backgroundColor: review.type === 'coaching' ? 'rgba(251, 191, 36, 0.2)' : 
                                           review.type === 'print' ? 'rgba(139, 92, 246, 0.2)' : 
                                           review.type === 'announcement' ? 'rgba(255, 107, 107, 0.2)' :
                                           'rgba(195, 179, 131, 0.2)'
                          }}>
                            {review.type === 'coaching' ? '✧ Coaching' : 
                             review.type === 'print' ? 'Print Shop' : 
                             review.type === 'announcement' ? '🎌 Annonce' :
                             'Service'}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
            className="p-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full hover:bg-card hover:border-primary/50 transition-all duration-200 flex items-center justify-center"
            aria-label="Previous review"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-primary scale-110" : "bg-muted hover:bg-muted-foreground/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % reviews.length)}
            className="p-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full hover:bg-card hover:border-primary/50 transition-all duration-200 flex items-center justify-center"
            aria-label="Next review"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
