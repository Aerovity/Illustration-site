"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reviews = [
  {
    name: "BAM",
    avatar: "/bam.png",
    rating: 5,
    comment: "Les cours de Florian, c’est l’assurance de progresser dans une ambiance à la fois chaleureuse et motivant ! Proche de ses élèves, il explique avec clarté et donne des conseils personnalisés sur nos créations, toujours pertinents et utiles pour avancer. Chaque séance est un vrai moment d’échange, avec des retours constructifs qui boostent notre motivation. L’excellente entente entre les élèves crée une dynamique de groupe où l’on s’encourage et se pousse mutuellement à progresser ! après ca... vous ne pouvez que nous rejoindre ! PS : Végéta est Algérien",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Retours Clients
        </h2>

        <div className="relative min-h-[400px] overflow-hidden">
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
                            <span className="text-xs px-2 py-1 rounded-full" style={{ color: '#c3b383', backgroundColor: 'rgba(195, 179, 131, 0.2)' }}>
                              Commission
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
                                   '#c3b383',
                            backgroundColor: review.type === 'coaching' ? 'rgba(251, 191, 36, 0.2)' : 
                                           review.type === 'print' ? 'rgba(139, 92, 246, 0.2)' : 
                                           'rgba(195, 179, 131, 0.2)'
                          }}>
                            {review.type === 'coaching' ? '✧ Coaching' : 
                             review.type === 'print' ? 'Print Shop' : 'Service'}
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

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
