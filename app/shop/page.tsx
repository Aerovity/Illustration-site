"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Plus, Minus, X, Instagram, Twitter, Youtube, Filter, ChevronDown, Search, Home, User, ImageIcon, Mail, Users, Palette, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderConfirmation } from "@/components/order-confirmation"
import { PaymentCancelledShop } from "@/components/payment-cancelled-shop"

interface PrintItem {
  id: string
  name: string
  image: string
  basePrice: number
  orientation?: 'portrait' | 'landscape' | 'square'
  license?: string
  createdAt: Date
  isBestseller?: boolean
}

interface CartItem extends PrintItem {
  size: string
  price: number
  quantity: number
  preview?: boolean
}

interface SizeOption {
  name: string
  displayName: string
  price: number
  format: string
  dimensions: string
}

const sizeOptions: SizeOption[] = [
  { name: "A6", displayName: "S", price: 2.50, format: "A6", dimensions: "105 × 148 mm" },
  { name: "A5", displayName: "M", price: 5.80, format: "A5", dimensions: "148 × 210 mm" },
  { name: "A4", displayName: "L", price: 7.80, format: "A4", dimensions: "210 × 297 mm" },
  { name: "A3", displayName: "XL", price: 13.50, format: "A3", dimensions: "297 × 420 mm" }
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
  const [selectedLicense, setSelectedLicense] = useState<string>('all')
  const [selectedSort, setSelectedSort] = useState<'recent' | 'ancien' | 'bestseller'>('recent')
  const [isLicenseDropdownOpen, setIsLicenseDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPrint, setSelectedPrint] = useState<PrintItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("A4")
  const [trackedShipping, setTrackedShipping] = useState<boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<string>("")
  const [canCheckout, setCanCheckout] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("print-shop")
  const [showCheckout, setShowCheckout] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [showPaymentCancelled, setShowPaymentCancelled] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const navItems = [
    { name: "Accueil", url: "/#accueil", icon: Home },
    { name: "Avis", url: "/#retours", icon: Mail },
    { name: "Portfolio", url: "/#about", icon: User },
    { name: "Galerie", url: "/gallerie", icon: ImageIcon },
    { name: "Contact", url: "/#contact", icon: Mail },
    { name: "Coaching", url: "/services#coaching", icon: Users },
    { name: "Commissions", url: "/services#commissions", icon: Palette },
    { name: "Print Shop", url: "/shop", icon: ShoppingCart },
    { name: "Ressources", url: "/services#ebooks", icon: BookOpen },
  ]

  useEffect(() => {
    setIsClient(true)
    
    // Check for payment results in URL
    const urlParams = new URLSearchParams(window.location.search)
    const paymentSuccess = urlParams.get('payment_success')
    const paymentCancelled = urlParams.get('payment_cancelled')
    const sessionIdParam = urlParams.get('session_id')
    
    if (paymentSuccess === 'true' && sessionIdParam) {
      setSessionId(sessionIdParam)
      setShowOrderConfirmation(true)
      // Clear cart on successful payment
      setCart([])
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (paymentCancelled === 'true') {
      setShowPaymentCancelled(true)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isLicenseDropdownOpen) {
        const target = e.target as Element
        if (!target.closest('[data-license-dropdown]')) {
          setIsLicenseDropdownOpen(false)
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClickOutside)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClickOutside)
    }
  }, [isLicenseDropdownOpen])

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
    // Load prints from prints.txt with URL - Name format
    const printData = [
      { url: "https://cdnb.artstation.com/p/assets/images/images/088/075/811/large/florian-bobe-33.jpg?1747378290", name: "Haikyu!!", license: "Haikyū!!", createdAt: new Date('2025-01-01'), isBestseller: true },
      { url: "https://cdnb.artstation.com/p/assets/images/images/086/487/343/small/florian-bobe-zoro3-copy.jpg?1743329346", name: "Roronoa Zoro", license: "One Piece", createdAt: new Date('2024-12-20'), isBestseller: false },
      { url: "https://cdnb.artstation.com/p/assets/images/images/085/631/309/small/florian-bobe-no-wm.jpg?1741258954", name: "Goku SSJ4 Daima", license: "Dragon Ball", createdAt: new Date('2024-12-15'), isBestseller: true },
      { url: "https://i.postimg.cc/Qd3drZCG/25-01-Shanks.jpg", name: "Akagami no Shanks", license: "One Piece", createdAt: new Date('2025-01-10'), isBestseller: true },
      { url: "https://cdnb.artstation.com/p/assets/images/images/082/404/301/small/florian-bobe-24-16-dandadan.jpg?1732884477", name: "DanDaDan", license: "DanDaDan", createdAt: new Date('2024-11-16'), isBestseller: false },
      { url: "https://cdnb.artstation.com/p/assets/images/images/082/231/903/small/florian-bobe-24-14-mirko.jpg?1732442755", name: "Mirko", license: "My Hero Academia", createdAt: new Date('2024-11-14'), isBestseller: false },
      { url: "https://i.postimg.cc/d3sKJn0x/22-Jotaro-Kujoh.jpg", name: "Jotaro Kujoh", license: "JoJo's Bizarre Adventure", createdAt: new Date('2022-06-15'), isBestseller: true },
      { url: "https://i.postimg.cc/ZnKXGR7k/24-11-Escanor.jpg", name: "Escanor", license: "Seven Deadly Sins", createdAt: new Date('2024-11-01'), isBestseller: false },
      { url: "https://cdna.artstation.com/p/assets/images/images/081/290/790/small/florian-bobe-24-10-kaiju-n8.jpg?1729855869", name: "Kaiju n8", license: "Kaiju No. 8", createdAt: new Date('2024-10-10'), isBestseller: false },
      { url: "https://cdna.artstation.com/p/assets/images/images/080/251/844/small/florian-bobe-24-09-dungeon-meshi.jpg?1727104540", name: "Dungeon Meshi", license: "Dungeon Meshi", createdAt: new Date('2024-09-09'), isBestseller: false },
      { url: "https://cdna.artstation.com/p/assets/images/images/076/628/730/small/florian-bobe-groupe-1-copie-2.jpg?1717427697", name: "Griffith", license: "Berserk", createdAt: new Date('2024-06-08'), isBestseller: true },
      { url: "https://cdnb.artstation.com/p/assets/images/images/076/294/325/small/florian-bobe-calque-1.jpg?1716648035", name: "Luffy v Kaido", license: "One Piece", createdAt: new Date('2024-05-07'), isBestseller: true },
      { url: "https://cdna.artstation.com/p/assets/images/images/076/101/418/small/florian-bobe-arriere-plan.jpg?1716200242", name: "Naruto Seinin", license: "Naruto", createdAt: new Date('2024-05-06'), isBestseller: false },
      { url: "https://cdna.artstation.com/p/assets/images/images/077/548/948/small/florian-bobe-24-05-sasuke-22-redraw.jpg?1719752691", name: "Sasuke Uchiha", license: "Naruto", createdAt: new Date('2024-05-05'), isBestseller: true },
      { url: "https://cdna.artstation.com/p/assets/images/images/075/925/280/small/florian-bobe-calque-77-copie-3.jpg?1715761266", name: "Fern", license: "Frieren", createdAt: new Date('2024-04-04'), isBestseller: false },
      { url: "https://i.postimg.cc/ydbNqJgv/24-03-Frieren.jpg", name: "Frieren", license: "Frieren", createdAt: new Date('2024-03-03'), isBestseller: true },
      { url: "https://cdna.artstation.com/p/assets/images/images/075/440/642/small/florian-bobe-20.jpg?1714573674", name: "Sung Jin Woo", license: "Solo Leveling", createdAt: new Date('2024-02-02'), isBestseller: true },
      { url: "https://cdna.artstation.com/p/assets/images/images/073/686/698/small/florian-bobe-16.jpg?1710251124", name: "King", license: "One Punch Man", createdAt: new Date('2024-01-01'), isBestseller: false },
      { url: "https://i.postimg.cc/Kjbmhnc7/23-Yor.jpg", name: "Yor", license: "Spy x Family", createdAt: new Date('2023-11-15'), isBestseller: true },
      { url: "https://i.postimg.cc/50qZvD1v/23-Vegeta-Ego.jpg", name: "Vegeta ego", license: "Dragon Ball", createdAt: new Date('2023-11-01'), isBestseller: false },
      { url: "https://i.postimg.cc/pL3btDq9/23-Nico-Robin.jpg", name: "Nico Robin", license: "One Piece", createdAt: new Date('2023-10-15'), isBestseller: true },
      { url: "https://i.postimg.cc/8zJ9w7NT/23-Mitsuri-Kanroji.jpg", name: "Mitsuri Kanroji", license: "Demon Slayer", createdAt: new Date('2023-10-01'), isBestseller: false },
      { url: "https://i.postimg.cc/Px4RNZzQ/23-Kyojuro-Rengoku.jpg", name: "Kyojuro Rengoku", license: "Demon Slayer", createdAt: new Date('2023-09-15'), isBestseller: true },
      { url: "https://i.postimg.cc/DZjPtcPH/23-Deku.jpg", name: "Deku", license: "My Hero Academia", createdAt: new Date('2023-09-01'), isBestseller: false },
      { url: "https://i.postimg.cc/G25vMmc1/23-A-Zoro.jpg", name: "Zoro", license: "One Piece", createdAt: new Date('2023-08-15'), isBestseller: true },
      { url: "https://i.postimg.cc/yx3c2Cd3/23-A-Usopp.jpg", name: "Usopp", license: "One Piece", createdAt: new Date('2023-08-01'), isBestseller: false },
      { url: "https://i.postimg.cc/pVmSP95z/23-A-Toji.jpg", name: "Toji", license: "Jujutsu Kaisen", createdAt: new Date('2023-07-15'), isBestseller: true },
      { url: "https://i.postimg.cc/3JHFzWXK/23-A-Sukuna.jpg", name: "Sukuna", license: "Jujutsu Kaisen", createdAt: new Date('2023-07-01'), isBestseller: true },
      { url: "https://i.postimg.cc/C1qbQVdB/23-A-Sanji.jpg", name: "Sanji", license: "One Piece", createdAt: new Date('2023-06-15'), isBestseller: false },
      { url: "https://i.postimg.cc/PfbwpyDj/23-A-Nanami.jpg", name: "Nanami", license: "Jujutsu Kaisen", createdAt: new Date('2023-06-01'), isBestseller: true },
      { url: "https://i.postimg.cc/yYQWcbYw/23-A-Nami.jpg", name: "Nami", license: "One Piece", createdAt: new Date('2023-05-15'), isBestseller: false },
      { url: "https://i.postimg.cc/1z6txRcQ/23-A-Luffy.jpg", name: "Luffy", license: "One Piece", createdAt: new Date('2023-05-01'), isBestseller: true },
      { url: "https://i.postimg.cc/fLfRLHrq/23-A-Gojo.jpg", name: "Gojo", license: "Jujutsu Kaisen", createdAt: new Date('2023-04-15'), isBestseller: true },
      { url: "https://i.postimg.cc/X7JYjkcx/22-Son-Goku-UI.jpg", name: "Goku UI", license: "Dragon Ball", createdAt: new Date('2022-12-01'), isBestseller: true },
      { url: "https://i.postimg.cc/g0vYSSmc/22-Shanks.jpg", name: "Shanks", license: "One Piece", createdAt: new Date('2022-11-15'), isBestseller: true },
      { url: "https://i.postimg.cc/76wqp3Z3/22-Sasuke.jpg", name: "Sasuke", license: "Naruto", createdAt: new Date('2022-11-01'), isBestseller: false },
      { url: "https://i.postimg.cc/50sW-TDGJ/22-Power.jpg", name: "Power", license: "Chainsaw Man", createdAt: new Date('2022-10-15'), isBestseller: true },
      { url: "https://i.postimg.cc/hPPfJBgL/22-Nami.jpg", name: "Nami", license: "One Piece", createdAt: new Date('2022-10-01'), isBestseller: false },
      { url: "https://i.postimg.cc/RFs2XK6V/22-Luffy-Wano.jpg", name: "Luffy Wano", license: "One Piece", createdAt: new Date('2022-09-15'), isBestseller: true },
      { url: "https://i.postimg.cc/mDKWT7bp/22-Luffy-G4.jpg", name: "Luffy G4", license: "One Piece", createdAt: new Date('2022-09-01'), isBestseller: false },
      { url: "https://i.postimg.cc/DzDMGFt8/22-Le-Blanc.png", name: "LeBlanc", license: "League of Legends", createdAt: new Date('2022-08-15'), isBestseller: false },
      { url: "https://i.postimg.cc/1X17WBRS/22-Ichigo.jpg", name: "Ichigo", license: "Bleach", createdAt: new Date('2022-08-01'), isBestseller: true },
      { url: "https://i.postimg.cc/26h2BWQK/22-Guts-redraw.jpg", name: "Guts", license: "Berserk", createdAt: new Date('2022-07-15'), isBestseller: true },
      { url: "https://i.postimg.cc/Y96zSHkc/22-Gojo.jpg", name: "Gojo", license: "Jujutsu Kaisen", createdAt: new Date('2022-07-01'), isBestseller: true },
      { url: "https://i.postimg.cc/y6kn4w3N/22-Erza-Scarlett.jpg", name: "Erza", license: "Fairy Tail", createdAt: new Date('2022-06-15'), isBestseller: false },
      { url: "https://i.postimg.cc/28cFyTp5/22-Eren-Yaeger.jpg", name: "Eren Yaeger", license: "Attack on Titan", createdAt: new Date('2022-06-01'), isBestseller: true },
      { url: "https://i.postimg.cc/63XCgmZM/22-Cell-Perfect.jpg", name: "Cell Perfect", license: "Dragon Ball", createdAt: new Date('2022-05-15'), isBestseller: false },
      { url: "https://i.postimg.cc/brYkNS3b/22-Bojji.jpg", name: "Bojji", license: "Ranking of Kings", createdAt: new Date('2022-05-01'), isBestseller: false },
      { url: "https://i.postimg.cc/zXcK8BWb/22-All-Might.jpg", name: "All Might", license: "My Hero Academia", createdAt: new Date('2022-04-15'), isBestseller: true }
    ]

    const loadPrintsWithOrientation = async () => {
      setIsLoading(true)
      setLoadingProgress(0)
      const printItems: PrintItem[] = []
      
      for (let index = 0; index < printData.length; index++) {
        const { url, name, license, createdAt, isBestseller } = printData[index]
        
        try {
          const orientation = await getImageOrientation(url)
          printItems.push({
            id: `print-${index}`,
            name: name,
            image: url,
            basePrice: 7.83, // Base A4 price
            orientation,
            license: license,
            createdAt: createdAt,
            isBestseller: isBestseller
          })
        } catch (error) {
          printItems.push({
            id: `print-${index}`,
            name: name,
            image: url,
            basePrice: 7.83,
            orientation: 'square', // Default fallback
            license: license,
            createdAt: createdAt,
            isBestseller: isBestseller
          })
        }
        
        // Update loading progress
        setLoadingProgress(((index + 1) / printData.length) * 100)
      }
      
      setPrints(printItems)
      setFilteredPrints(printItems)
      
      // Add a small delay to show the completion, then hide loading
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    loadPrintsWithOrientation()
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedOrientation, selectedLicense, selectedSort, searchQuery])

  useEffect(() => {
    setCanCheckout(cart.length > 0 && selectedDelivery !== "")
  }, [cart, selectedDelivery])

  useEffect(() => {
    let filtered = prints

    // Filter by orientation
    if (selectedOrientation !== 'all') {
      filtered = filtered.filter(print => print.orientation === selectedOrientation)
    }

    // Filter by license
    if (selectedLicense !== 'all') {
      filtered = filtered.filter(print => print.license === selectedLicense)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(print => 
        print.name.toLowerCase().includes(query) || 
        (print.license && print.license.toLowerCase().includes(query))
      )
    }

    // Sort by selected criteria
    if (selectedSort === 'recent') {
      filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (selectedSort === 'ancien') {
      filtered = filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    } else if (selectedSort === 'bestseller') {
      filtered = filtered.sort((a, b) => {
        if (a.isBestseller && !b.isBestseller) return -1
        if (!a.isBestseller && b.isBestseller) return 1
        return b.createdAt.getTime() - a.createdAt.getTime() // Secondary sort by date
      })
    }

    setFilteredPrints(filtered)
  }, [prints, selectedOrientation, selectedLicense, selectedSort, searchQuery])

  // Get unique licenses for dropdown
  const getUniqueLicenses = () => {
    const licenses = prints.map(print => print.license).filter(Boolean)
    return [...new Set(licenses)].sort()
  }

  // Get filtered prints count by license
  const getLicenseCount = (license: string) => {
    let filtered = prints
    if (selectedOrientation !== 'all') {
      filtered = filtered.filter(print => print.orientation === selectedOrientation)
    }
    return filtered.filter(print => print.license === license).length
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrints.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPrints = filteredPrints.slice(startIndex, endIndex)

  // Handle orientation filter toggle
  const handleOrientationFilter = (orientation: 'all' | 'portrait' | 'landscape' | 'square') => {
    if (selectedOrientation === orientation) {
      setSelectedOrientation('all') // Toggle off if same filter is clicked
    } else {
      setSelectedOrientation(orientation)
    }
  }

  // Handle license filter toggle
  const handleLicenseFilter = (license: string) => {
    if (selectedLicense === license) {
      setSelectedLicense('all') // Toggle off if same filter is clicked
    } else {
      setSelectedLicense(license)
    }
    setIsLicenseDropdownOpen(false)
  }

  const openPrintModal = (print: PrintItem) => {
    setSelectedPrint(print)
    setSelectedSize("A4")
    setTrackedShipping(false)
  }

  const closePrintModal = () => {
    setSelectedPrint(null)
    setIsImageExpanded(false)
  }

  const addToCart = () => {
    if (!selectedPrint) return

    const sizeOption = sizeOptions.find(s => s.name === selectedSize)
    const sizePrice = sizeOption?.price || 10.80
    const shippingCost = trackedShipping ? 0.50 : 0
    const totalPrice = sizePrice + shippingCost

    const cartItem: CartItem = {
      ...selectedPrint,
      size: sizeOption?.displayName || 'L',
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
      <NavBar 
        items={navItems} 
        activeSection={activeSection}
        showCart={true}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden mt-20">
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
      {!isLoading && (
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom ou licence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Sort Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <button
                onClick={() => setSelectedSort('recent')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedSort === 'recent'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Récent
              </button>
              <button
                onClick={() => setSelectedSort('ancien')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedSort === 'ancien'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Ancien
              </button>
              <button
                onClick={() => setSelectedSort('bestseller')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedSort === 'bestseller'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Best Seller
              </button>
            </div>

            {/* Orientation Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleOrientationFilter('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedOrientation === 'all'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Tous ({prints.length})
              </button>
              <button
                onClick={() => handleOrientationFilter('portrait')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedOrientation === 'portrait'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Portrait ({prints.filter(p => p.orientation === 'portrait').length})
              </button>
              <button
                onClick={() => handleOrientationFilter('landscape')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedOrientation === 'landscape'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Splash Art ({prints.filter(p => p.orientation === 'landscape').length})
              </button>
              <button
                onClick={() => handleOrientationFilter('square')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedOrientation === 'square'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                Carré ({prints.filter(p => p.orientation === 'square').length})
              </button>
            </div>

            {/* License Filter Dropdown */}
            <div className="relative" data-license-dropdown>
              <button
                onClick={() => setIsLicenseDropdownOpen(!isLicenseDropdownOpen)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-200 min-w-[200px] justify-center ${
                  selectedLicense !== 'all'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>
                  {selectedLicense === 'all' ? 'Toutes les licences' : selectedLicense}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLicenseDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLicenseDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background border border-border/50 rounded-lg shadow-lg z-50 w-[800px] max-w-[90vw]">
                  <div className="p-4 grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => handleLicenseFilter('all')}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-center text-sm ${
                        selectedLicense === 'all' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card/50 hover:bg-muted border border-border/30'
                      }`}
                    >
                      <div>Toutes</div>
                      <div className="text-xs opacity-70">({prints.length})</div>
                    </button>
                    {getUniqueLicenses().map((license) => (
                      <button
                        key={license}
                        onClick={() => handleLicenseFilter(license)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors text-center text-sm ${
                          selectedLicense === license 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-card/50 hover:bg-muted border border-border/30'
                        }`}
                      >
                        <div className="leading-tight">{license}</div>
                        <div className="text-xs opacity-70">({getLicenseCount(license)})</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Loading Screen */}
      {isLoading ? (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Chargement des œuvres...
              </h2>
              <p className="text-muted-foreground mb-8">
                Nous préparons votre galerie d'art personnalisée
              </p>
              
              {/* Progress bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="h-2 bg-card/50 rounded-full overflow-hidden border border-border/50">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Loading skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden aspect-square">
                    <div className="w-full h-full bg-muted/50 animate-pulse relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Prints Gallery */
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Results Summary */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                {filteredPrints.length > 0 ? (
                  <>Affichage {startIndex + 1}-{Math.min(endIndex, filteredPrints.length)} sur {filteredPrints.length} résultats</>
                ) : (
                  'Aucun résultat trouvé'
                )}
              </p>
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {currentPrints.map((print, index) => (
                <Card 
                  key={print.id} 
                  className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer transition-all duration-200 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => openPrintModal(print)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={print.image}
                        alt={print.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-200"
                        loading="lazy"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <h3 className="text-white font-semibold mb-2">{print.name}</h3>
                        <p className="text-white text-xs opacity-75 mb-1">{print.license}</p>
                        <p className="text-white font-bold">À partir de {sizeOptions[0].price}€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mb-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </section>
      )}

      {/* Print Selection Modal */}
      {selectedPrint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image Preview - Takes 2/3 of space */}
                <div className="lg:col-span-2">
                  <div 
                    className="relative w-full h-[500px] overflow-hidden rounded-lg cursor-pointer hover:scale-[1.02] transition-transform duration-200 bg-muted"
                    onClick={() => setIsImageExpanded(true)}
                  >
                    <Image
                      src={selectedPrint.image}
                      alt={selectedPrint.name}
                      fill
                      className="object-contain object-center"
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Selection and Details - Takes 1/3 of space */}
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
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{option.displayName}</div>
                              <div className="text-xs text-muted-foreground">{option.format}</div>
                            </div>
                            <span className="font-bold">{option.price.toFixed(2)} €</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tracked Shipping Option */}
                  <div>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trackedShipping}
                        onChange={(e) => setTrackedShipping(e.target.checked)}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Colis Suivi</span>
                        <div className="text-xs text-muted-foreground">Suivi de votre commande</div>
                      </div>
                      <span className="font-bold text-primary">+ 0,50 €</span>
                    </label>
                  </div>

                  {/* Quality Details */}
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Made by BobeFlorian</strong></p>
                    <div className="space-y-1">
                      <p>✓ Format {sizeOptions.find(s => s.name === selectedSize)?.format || 'A4'}</p>
                      <p>✓ Matière Matte Nacré</p>
                      <p>✓ Papier épais grande qualité</p>
                      <p>✓ Couleur fidèle</p>
                      <p>✓ Dimensions: {sizeOptions.find(s => s.name === selectedSize)?.dimensions || '210 × 297 mm'}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span>Print {sizeOptions.find(s => s.name === selectedSize)?.displayName || 'L'}:</span>
                        <span className="font-bold">{(sizeOptions.find(s => s.name === selectedSize)?.price || 0).toFixed(2)} €</span>
                      </div>
                      {trackedShipping && (
                        <div className="flex justify-between items-center text-sm">
                          <span>Colis Suivi:</span>
                          <span className="font-bold">0,50 €</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-primary">
                          {((sizeOptions.find(s => s.name === selectedSize)?.price || 0) + (trackedShipping ? 0.50 : 0)).toFixed(2)} €
                        </span>
                      </div>
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
                        <div className="relative w-16 h-16 overflow-hidden rounded bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                            style={{ objectFit: 'cover' }}
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
                          setShowCheckout(true)
                          setIsCartOpen(false)
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

      {/* Checkout Form Modal */}
      {showCheckout && (
        <CheckoutForm
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cart={cart}
          deliveryOption={selectedDelivery}
          deliveryPrice={getDeliveryPrice()}
          totalAmount={getFinalTotal()}
        />
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && sessionId && (
        <OrderConfirmation
          sessionId={sessionId}
          onClose={() => {
            setShowOrderConfirmation(false)
            setSessionId(null)
          }}
        />
      )}

      {/* Payment Cancelled Modal */}
      {showPaymentCancelled && (
        <PaymentCancelledShop
          onClose={() => setShowPaymentCancelled(false)}
          onRetry={() => {
            setShowPaymentCancelled(false)
            setShowCheckout(true)
          }}
        />
      )}

    </div>
  )
}