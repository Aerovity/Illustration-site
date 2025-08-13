"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reviews = [
  {
    name: "revieweur",
    avatar: "/images/profile.jpg",
    rating: 4,
    comment: "wesh gros !",
  },
  {
    name: "revieweur",
    avatar: "/images/artwork-1.jpg",
    rating: 5,
    comment: "wesh gros !",
  },
  {
    name: "revieweur",
    avatar: "/images/artwork-2.jpg",
    rating: 5,
    comment: "wesh gros !",
  },
  {
    name: "revieweur",
    avatar: "/images/artwork-3.jpg",
    rating: 5,
    comment: "wesh gros !",
  },
  {
    name: "revieweur",
    avatar: "/images/artwork-4.jpg",
    rating: 5,
    comment: "wesh gros !",
  },
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
          Témoignages Clients
        </h2>

        <div className="relative h-64 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 max-w-2xl mx-auto">
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
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4" style={{ fill: '#f4e6d0', color: '#f4e6d0' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
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
