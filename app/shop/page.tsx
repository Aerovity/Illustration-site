"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Plus, Minus, X, Instagram, Twitter, Youtube } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface PrintItem {
  id: string
  name: string
  image: string
  basePrice: number
  orientation?: 'portrait' | 'landscape' | 'square'
}

interface CartItem extends PrintItem {
  size: string
  price: number
  quantity: number
  preview?: boolean
}

interface SizeOption {
  name: string
  price: number
}

const sizeOptions: SizeOption[] = [
  { name: "A6", price: 5.41 },
  { name: "A5", price: 8.86 },
  { name: "A4", price: 10.83 },
  { name: "A3", price: 16.24 }
]

const deliveryOptions = [
  {
    region: "France",
    service: "La Poste – Lettre verte (2-3j ouvrés)",
    basePrice: 2.50,
    additionalPrice: 0.20
  },
  {
    region: "Union européenne",
    service: "La Poste – International UE (délais variables)",
    basePrice: 4.10,
    additionalPrice: 0.50
  },
  {
    region: "Europe hors UE",
    service: "La Poste – International reste du monde (délais variables)",
    basePrice: 5.00,
    additionalPrice: 0.50
  },
  {
    region: "Autres pays",
    service: "La Poste – International reste du monde (délais variables)",
    basePrice: 5.00,
    additionalPrice: 0.50
  }
]

export default function ShopPage() {
  const [prints, setPrints] = useState<PrintItem[]>([])
  const [filteredPrints, setFilteredPrints] = useState<PrintItem[]>([])
  const [selectedOrientation, setSelectedOrientation] = useState<'all' | 'portrait' | 'landscape' | 'square'>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPrint, setSelectedPrint] = useState<PrintItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("A4")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<string>("")
  const [canCheckout, setCanCheckout] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const getImageOrientation = (imagePath: string): Promise<'portrait' | 'landscape' | 'square'> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const ratio = img.width / img.height
        if (ratio > 1.1) {
          resolve('landscape')
        } else if (ratio < 0.9) {
          resolve('portrait')
        } else {
          resolve('square')
        }
      }
      img.onerror = () => resolve('square') // Default fallback
      img.src = imagePath
    })
  }

  useEffect(() => {
    // Load prints from /public/prints folder - reversed order to show newest first
    const printFiles = [
      "25_05_20_Haikyū!!.png", "25_05_10_Zoro.png", "25_04_03_Goku_Daima.png", "25_01_Shanks.jpg", 
      "24_16_DanDadan.jpg", "24_13_Mirko.png", "24_12_Jotaro_redraw.jpg", "24_11_Escanor.jpg",
      "24_10_Kaiju_n8.jpg", "24_09_Dungeon_Meshi.jpg", "24_08_Griffith.jpg", "24_07_Luffy_V_Kaido.jpg",
      "24_06_Naruto_Sennin.jpg", "24_05_Sasuke_22_redraw.jpg", "24_04_Fern.jpg", "24_03_Frieren.jpg", 
      "24_02_Sung_Jinwoo.jpg", "24_01_King.jpg", "23_Yoruichi.jpg", "23_Yor.jpg", "23_Vegeta_Ego.jpg",
      "23_Nico_Robin.jpg", "23_Mitsuri_Kanroji.jpg", "23_Kyojuro_Rengoku.jpg", "23_Deku.jpg", "23_A_Zoro.jpg",
      "23_A_Usopp.jpg", "23_A_Toji.jpg", "23_A_Sukuna.jpg", "23_A_Sanji.jpg", "23_A_Nanami.jpg",
      "23_A_Nami.jpg", "23_A_Luffy.jpg", "23_A_Gojo.jpg", "22_Son_Goku_UI.jpg", "22_Shanks.jpg",
      "22_Sasuke.jpg", "22_Power.jpg", "22_Nami.jpg", "22_Luffy_G4.jpg", "22_Jotaro_Kujoh.jpg",
      "22_Ichigo.jpg", "22_Guts_redraw.jpg", "22_Gojo.jpg", "22_Erza_Scarlett.jpg", "22_Eren_Yaeger.jpg",
      "22_Cell_Perfect.jpg", "22_Bojji.jpg", "22_All_Might.jpg", "22_Luffy_Wano.jpg", "22_LeBlanc.png"
    ]

    const loadPrintsWithOrientation = async () => {
      const printItems: PrintItem[] = []
      
      for (let index = 0; index < printFiles.length; index++) {
        const file = printFiles[index]
        // Extract name from filename (remove extension and numbers/prefixes)
        const name = file.replace(/\.(jpg|png)$/i, '').replace(/^[\d#_]+/, '').replace(/_/g, ' ')
        const imagePath = `/prints/${file}`
        
        try {
          const orientation = await getImageOrientation(imagePath)
          printItems.push({
            id: `print-${index}`,
            name: name || file.replace(/\.(jpg|png)$/i, ''),
            image: imagePath,
            basePrice: 10.83, // Base A4 price
            orientation
          })
        } catch (error) {
          printItems.push({
            id: `print-${index}`,
            name: name || file.replace(/\.(jpg|png)$/i, ''),
            image: imagePath,
            basePrice: 10.83,
            orientation: 'square' // Default fallback
          })
        }
      }
      
      setPrints(printItems)
      setFilteredPrints(printItems)
    }

    loadPrintsWithOrientation()
  }, [])

  useEffect(() => {
    setCanCheckout(cart.length > 0 && selectedDelivery !== "")
  }, [cart, selectedDelivery])

  useEffect(() => {
    if (selectedOrientation === 'all') {
      setFilteredPrints(prints)
    } else {
      setFilteredPrints(prints.filter(print => print.orientation === selectedOrientation))
    }
  }, [prints, selectedOrientation])

  const openPrintModal = (print: PrintItem) => {
    setSelectedPrint(print)
    setSelectedSize("A4")
  }

  const closePrintModal = () => {
    setSelectedPrint(null)
    setIsImageExpanded(false)
  }

  const addToCart = () => {
    if (!selectedPrint) return

    const sizePrice = sizeOptions.find(s => s.name === selectedSize)?.price || 10.83
    const totalPrice = sizePrice

    const cartItem: CartItem = {
      ...selectedPrint,
      size: selectedSize,
      price: totalPrice,
      quantity: 1,
    }

    setCart(prev => {
      const existing = prev.find(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size
      )
      
      if (existing) {
        return prev.map(item => 
          item === existing 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, cartItem]
    })

    closePrintModal()
  }

  const removeFromCart = (itemToRemove: CartItem) => {
    setCart(prev => prev.filter(item => item !== itemToRemove))
  }

  const updateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item)
      return
    }
    
    setCart(prev => prev.map(cartItem => 
      cartItem === item 
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    ))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryPrice = () => {
    if (!selectedDelivery) return 0
    
    const delivery = deliveryOptions.find(d => d.region === selectedDelivery)
    if (!delivery) return 0
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    if (totalItems === 0) return 0
    
    return delivery.basePrice + (delivery.additionalPrice * Math.max(0, totalItems - 1))
  }

  const getFinalTotal = () => {
    return getCartTotal() + getDeliveryPrice()
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
      {/* Header with Cart */}
      <header className="sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour
              </button>
              <Image src="/images/logo.png" alt="Bobe Florian Logo" width={120} height={40} className="h-8 w-auto" />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/artwork-4.jpg"
            alt="Print Shop Background"
            fill
            className="object-cover opacity-30"
            style={{ objectPosition: "center 30%" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/70" />
          {/* Reduced spotlight effect for hero background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={
              {
                background: `radial-gradient(
                  circle at ${isClient ? `${(mousePosition.x / window.innerWidth) * 100}%` : "50%"} ${isClient ? `${(mousePosition.y / window.innerHeight) * 100}%` : "50%"},
                  rgba(139, 92, 246, 0.06) 0%,
                  rgba(139, 92, 246, 0.02) 25%,
                  transparent 50%
                )`
              } as React.CSSProperties
            }
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Print Shop
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez ma collection d'œuvres d'art imprimées en haute qualité
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedOrientation('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedOrientation === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
              }`}
            >
              Tous ({prints.length})
            </button>
            <button
              onClick={() => setSelectedOrientation('portrait')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedOrientation === 'portrait'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
              }`}
            >
              Portrait ({prints.filter(p => p.orientation === 'portrait').length})
            </button>
            <button
              onClick={() => setSelectedOrientation('landscape')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedOrientation === 'landscape'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
              }`}
            >
              Paysage ({prints.filter(p => p.orientation === 'landscape').length})
            </button>
            <button
              onClick={() => setSelectedOrientation('square')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedOrientation === 'square'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
              }`}
            >
              Carrée ({prints.filter(p => p.orientation === 'square').length})
            </button>
          </div>
        </div>
      </section>

      {/* Prints Gallery */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPrints.map((print) => (
              <Card 
                key={print.id} 
                className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer transition-colors duration-200 group"
                onClick={() => openPrintModal(print)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={print.image}
                      alt={print.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold mb-2">{print.name}</h3>
                      <p className="text-white font-bold">À partir de {sizeOptions[0].price}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Print Selection Modal */}
      {selectedPrint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedPrint.name}</h2>
                <button
                  onClick={closePrintModal}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsImageExpanded(true)}
                >
                  <Image
                    src={selectedPrint.image}
                    alt={selectedPrint.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Choisir la taille</h3>
                    <div className="space-y-2">
                      {sizeOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => setSelectedSize(option.name)}
                          className={`w-full p-3 text-left border rounded-lg transition-colors ${
                            selectedSize === option.name
                              ? 'border-primary bg-primary/20'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{option.name}</span>
                            <span className="font-bold">{option.price}€</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>


                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Made by BobeFlorian</strong></p>
                    <p>Materials: Paper</p>
                    <p>Width: 210 millimetres</p>
                    <p>Height: 297 millimetres</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        {(sizeOptions.find(s => s.name === selectedSize)?.price || 0).toFixed(2)}€
                      </span>
                    </div>
                    <EnhancedSpotlightButton 
                      onClick={addToCart}
                      className="w-full"
                    >
                      Ajouter au panier
                    </EnhancedSpotlightButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-purple-400">Votre Panier</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="relative w-16 h-16 overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Taille: {item.size}
                          </p>
                          <p className="font-bold text-primary mt-1">{item.price.toFixed(2)}€</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="p-1 hover:bg-background rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="p-1 hover:bg-background rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="p-2 hover:bg-background rounded text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Selection */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-purple-400">Options de livraison</h3>
                    <div className="space-y-2">
                      {deliveryOptions.map((option) => (
                        <button
                          key={option.region}
                          onClick={() => setSelectedDelivery(option.region)}
                          className={`w-full p-4 text-left border rounded-lg transition-colors ${
                            selectedDelivery === option.region
                              ? 'border-primary bg-primary/20'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <div className="font-medium">{option.region}</div>
                          <div className="text-sm text-muted-foreground">{option.service}</div>
                          <div className="text-sm">
                            Un article: {option.basePrice.toFixed(2)}€, Article supplémentaire: {option.additionalPrice.toFixed(2)}€
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="border-t pt-6">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293L10 7.586A1 1 0 0010.414 8H12m0 0v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293L12 7.586A1 1 0 0012.414 8H14m0 0v8a2 2 0 01-2 2h-3a2 2 0 01-2-2V8" />
                        </svg>
                        <span className="font-medium text-green-700 dark:text-green-300">Arrivée bientôt ! Recevez-le entre le 18-28 août</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">si vous commandez aujourd'hui</p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Retours et échanges acceptés</span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>{getCartTotal().toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison:</span>
                        <span>{getDeliveryPrice().toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-primary">{getFinalTotal().toFixed(2)}€</span>
                      </div>
                    </div>
                    <EnhancedSpotlightButton 
                      className="w-full"
                      disabled={!canCheckout}
                      onClick={() => {
                        if (canCheckout) {
                          alert('Fonctionnalité de paiement à venir!')
                        }
                      }}
                    >
                      {!selectedDelivery ? 'Choisir une option de livraison' : 'Procéder au paiement'}
                    </EnhancedSpotlightButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Image Modal */}
      {isImageExpanded && selectedPrint && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedPrint.image}
                alt={selectedPrint.name}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

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
                  <button onClick={() => window.location.href = '/'} className="hover:text-primary transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '/'} className="hover:text-primary transition-colors">
                    Coaching Pro
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