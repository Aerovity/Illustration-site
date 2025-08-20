"use client"

import React, { useState, useRef } from "react"
import { X, CreditCard, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import { loadStripe } from '@stripe/stripe-js'

interface SubscriptionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionForm({ isOpen, onClose }: SubscriptionFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    discordUsername: ''
  })
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!formRef.current) {
      setSubmitError('Erreur de formulaire')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create payment session with Stripe
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          discordUsername: formData.discordUsername,
          successUrl: `${window.location.origin}/services?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/services?cancelled=true`
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

  if (isSubmitted && orderId) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-green-400">
              Merci Pour Votre Paiement !
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <div className="text-lg font-semibold">
                Voici votre Order ID: <span className="text-primary">{orderId}</span>
              </div>
              <p className="text-muted-foreground">
                Je vous contacterai prochainement. En attendant, veuillez rejoindre notre Discord :
              </p>
              <a
                href="https://discord.gg/SEXPnbkBsg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 underline"
              >
                Rejoindre le Discord
              </a>
            </div>
            <EnhancedSpotlightButton
              onClick={() => window.location.href = '/services'}
              className="w-full mt-6"
            >
              Retour aux Services
            </EnhancedSpotlightButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Inscription Cours Collectifs
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </CardTitle>
          <CardDescription>
            Remplissez vos informations pour vous inscrire aux cours collectifs (48€/mois)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-primary">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
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
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Votre nom"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                Adresse Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="discordUsername" className="text-sm font-medium text-primary">
                Discord Username *
              </label>
              <input
                id="discordUsername"
                name="discordUsername"
                type="text"
                required
                value={formData.discordUsername}
                onChange={(e) => handleInputChange('discordUsername', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="username#1234 ou @username"
              />
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

            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Récapitulatif :</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Cours collectifs Feedbacker : 48€/mois</li>
                <li>• Sessions de feedback en direct : 4h/semaine</li>
                <li>• Accès VIP Discord</li>
                <li>• Lundi et jeudi de 18h à 20h</li>
              </ul>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <EnhancedSpotlightButton
              type="submit"
              disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || !formData.discordUsername}
              className={`w-full py-0.5 text-lg transition-opacity ${
                !formData.firstName || !formData.lastName || !formData.email || !formData.discordUsername ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                {isSubmitting ? "Redirection vers le paiement..." : "Procéder au Paiement"}
              </div>
            </EnhancedSpotlightButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}