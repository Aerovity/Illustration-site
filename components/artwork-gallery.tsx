"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const artworks = [
  { src: "/images/artwork-1.jpg", alt: "Illustration fantastique rouge", title: "Énergie Mystique" },
  { src: "/images/artwork-2.jpg", alt: "Sorcière mystique", title: "Magie Ancienne" },
  { src: "/images/artwork-3.jpg", alt: "Combat épique", title: "Bataille Céleste" },
  { src: "/images/artwork-4.jpg", alt: "Créatures sombres", title: "Ombres et Lumière" },
  { src: "/images/artwork-5.jpg", alt: "Ultra Instinct", title: "Puissance Divine" },
  { src: "/images/artwork-6.jpg", alt: "Épéiste vert", title: "Lames Spirituelles" },
  { src: "/images/artwork-7.jpg", alt: "Naruto et créature", title: "Compagnons Légendaires" },
]

export function ArtworkGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Galerie d'Œuvres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={artwork.src || "/placeholder.svg"}
                      alt={artwork.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold text-lg">{artwork.title}</h3>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                <div className="relative aspect-[4/5] w-full max-h-[90vh]">
                  <Image
                    src={artwork.src || "/placeholder.svg"}
                    alt={artwork.alt}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
