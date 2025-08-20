"use client"

import React, { useState, useRef, useEffect } from "react"
import { X, CreditCard, Lock, MapPin, User, Mail, Phone, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { loadStripe } from '@stripe/stripe-js'

interface CartItem {
  id: string
  name: string
  image: string
  size: string
  price: number
  quantity: number
  license?: string
}

interface CheckoutFormProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  deliveryOption: string
  deliveryPrice: number
  totalAmount: number
}

interface AddressData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export function CheckoutForm({ 
  isOpen, 
  onClose, 
  cart, 
  deliveryOption, 
  deliveryPrice, 
  totalAmount 
}: CheckoutFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [addressData, setAddressData] = useState<AddressData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  
  // Country options based on delivery region
  const getCountryOptions = () => {
    switch (deliveryOption) {
      case 'France':
        return ['France']
      case 'Union européenne':
        return [
          'Allemagne', 'Autriche', 'Belgique', 'Bulgarie', 'Chypre', 'Croatie',
          'Danemark', 'Espagne', 'Estonie', 'Finlande', 'Grèce', 'Hongrie',
          'Irlande', 'Italie', 'Lettonie', 'Lituanie', 'Luxembourg', 'Malte',
          'Pays-Bas', 'Pologne', 'Portugal', 'République tchèque', 'Roumanie',
          'Slovaquie', 'Slovénie', 'Suède'
        ]
      case 'Europe hors UE':
        return [
          'Suisse', 'Norvège', 'Royaume-Uni', 'Islande', 'Liechtenstein',
          'Monaco', 'Andorre', 'San Marin', 'Vatican'
        ]
      case 'Autres pays':
        return [
          'États-Unis', 'Canada', 'Australie', 'Japon', 'Corée du Sud',
          'Singapour', 'Nouvelle-Zélande', 'Brésil', 'Argentine', 'Mexique',
          'Russie', 'Chine', 'Inde', 'Afrique du Sud', 'Maroc', 'Tunisie',
          'Algérie', 'Autre...'
        ]
      default:
        return []
    }
  }
  
  // Set default country when delivery option changes
  useEffect(() => {
    const countries = getCountryOptions()
    if (countries.length === 1) {
      setAddressData(prev => ({ ...prev, country: countries[0] }))
    } else if (countries.length > 0 && !addressData.country) {
      setAddressData(prev => ({ ...prev, country: '' }))
    }
  }, [deliveryOption])
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCountryDropdown) {
        const target = event.target as Element
        if (!target.closest('[data-country-dropdown]')) {
          setShowCountryDropdown(false)
        }
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showCountryDropdown])

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    return addressData.firstName && 
           addressData.lastName && 
           addressData.email && 
           addressData.address && 
           addressData.city && 
           addressData.postalCode && 
           addressData.country
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!formRef.current || !isFormValid()) {
      setSubmitError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create payment session with Stripe
      const response = await fetch('/api/create-shop-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          address: addressData,
          deliveryOption,
          deliveryPrice,
          totalAmount,
          successUrl: `${window.location.origin}/shop?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/shop?payment_cancelled=true`
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement')
      }

      const { sessionId } = await response.json()

      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (!stripe) {
        throw new Error('Erreur lors du chargement de Stripe')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      })

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      console.error('Payment error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Erreur lors du paiement. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informations de livraison
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </CardTitle>
          <CardDescription>
            Renseignez vos informations pour la livraison de votre commande
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-primary flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Prénom *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={addressData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Votre prénom"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-primary">
                  Nom *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={addressData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Adresse Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={addressData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-primary flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Téléphone (optionnel)
              </label>
              <input
                id="phone"
                type="tel"
                value={addressData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Address Information */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-primary">
                Adresse *
              </label>
              <input
                id="address"
                type="text"
                required
                value={addressData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="123 Rue de la Paix"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-primary">
                  Ville *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={addressData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Paris"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="postalCode" className="text-sm font-medium text-primary">
                  Code Postal *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={addressData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="75001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-primary">
                Pays/Région *
              </label>
              {getCountryOptions().length === 1 ? (
                <input
                  id="country"
                  type="text"
                  required
                  value={addressData.country}
                  readOnly
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none cursor-not-allowed opacity-75"
                  placeholder="Sélectionné automatiquement"
                />
              ) : (
                <div className="relative" data-country-dropdown>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-left flex items-center justify-between"
                  >
                    <span className={addressData.country ? 'text-foreground' : 'text-muted-foreground'}>
                      {addressData.country || 'Sélectionnez votre pays'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {getCountryOptions().map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            setAddressData(prev => ({ ...prev, country }))
                            setShowCountryDropdown(false)
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {getCountryOptions().length === 1 
                  ? 'Pays défini par votre option de livraison'
                  : `Pays disponibles pour: ${deliveryOption}`
                }
              </p>
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-medium mb-3">Récapitulatif de la commande</h3>
              <div className="space-y-2 text-sm">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} (Taille {item.size}) × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2">
                  <span>Livraison ({deliveryOption})</span>
                  <span>{deliveryPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">{totalAmount.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-green-400" />
                <span className="font-medium">Paiement sécurisé avec Stripe</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paiement accepté par : Carte de crédit, Google Pay, Apple Pay
              </p>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <EnhancedSpotlightButton
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`w-full py-0.5 text-lg transition-opacity ${
                !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                {isSubmitting ? "Redirection vers le paiement..." : `Payer ${totalAmount.toFixed(2)}€`}
              </div>
            </EnhancedSpotlightButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}