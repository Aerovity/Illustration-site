"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

const artworks = [
  { src: "/images/artwork-1.jpg", alt: "Hell Joe - Tower of God", title: "Hell Joe - Tower of God" },
  { src: "/images/artwork-2.jpg", alt: "Recluse - Nightreign", title: "Recluse - Nightreign" },
  { src: "/images/artwork-3.jpg", alt: "Luffy V Kaido", title: "Luffy V Kaido " },
  { src: "/images/artwork-4.jpg", alt: "Necromancer", title: "Necromancer" },
  { src: "/images/artwork-5.jpg", alt: "Ultra Instinct", title: "Ultra Instinct" },
  { src: "/images/artwork-6.jpg", alt: "Roronoa Zoro", title: "Roronoa Zoro" },
  { src: "/images/artwork-7.jpg", alt: "Naruto Sennin", title: "Naruto Sennin" },
]

export function ArtworkGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      // Prevent text selection during drag
      document.body.style.userSelect = 'none'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Re-enable text selection
    document.body.style.userSelect = ''
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Galerie d'Œuvres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork, index) => (
            <Dialog key={index} onOpenChange={(open) => {
              if (open) {
                setZoomLevel(1)
                setPosition({ x: 0, y: 0 })
                setSelectedImage(artwork.src)
              }
            }}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={artwork.src || "/placeholder.svg"}
                      alt={artwork.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      quality={95}
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold text-lg">{artwork.title}</h3>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-7xl w-full h-[95vh] p-0 bg-black/95 border-none">
                <VisuallyHidden>
                  <DialogTitle>{artwork.title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full h-full overflow-hidden select-none">
                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      disabled={zoomLevel <= 0.5}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      disabled={zoomLevel >= 4}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="absolute top-4 left-4 z-50 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                    {Math.round(zoomLevel * 100)}%
                  </div>

                  {/* Image Container */}
                  <div
                    className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
                    style={{ 
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div
                      className="relative transition-transform duration-200 ease-out"
                      style={{
                        transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: '90%',
                        height: '90%'
                      }}
                    >
                      <Image
                        src={artwork.src || "/placeholder.svg"}
                        alt={artwork.alt}
                        fill
                        className="object-contain select-none"
                        quality={100}
                        unoptimized={true}
                      />
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-50 text-center">
                    <h3 className="text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-full inline-block">
                      {artwork.title}
                    </h3>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
