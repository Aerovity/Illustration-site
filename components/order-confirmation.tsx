"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle, Mail, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"
import Link from "next/link"

interface OrderConfirmationProps {
  sessionId: string
  onClose: () => void
}

interface OrderDetails {
  id: string
  customer_email: string
  payment_status: string
  amount_total: number
  currency: string
  metadata: any
  shipping: any
}

export function OrderConfirmation({ sessionId, onClose }: OrderConfirmationProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Just set a simple order confirmation without API call
    if (sessionId) {
      setOrderDetails({
        id: sessionId,
        customer_email: 'Envoyé à votre email',
        payment_status: 'paid',
        amount_total: 0,
        currency: 'eur',
        metadata: {},
        shipping: {}
      })
    }
    setLoading(false)
  }, [sessionId])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-400">
            <CheckCircle className="h-6 w-6" />
            Merci pour Votre Achat !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Récupération des détails de commande...</p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold mb-2">
                  Voici votre ID unique de paiement :
                </div>
                <div className="text-primary font-mono text-sm bg-primary/10 p-3 rounded border">
                  {sessionId}
                </div>
                <p className="text-xs text-muted-foreground">
                  (Confirmation de paiement)
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      Email de confirmation envoyé
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Vérifiez votre boîte de réception ({orderDetails?.customer_email})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Préparation de votre commande
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Expédition sous 2-3 jours ouvrés
                    </p>
                  </div>
                </div>
              </div>

              {orderDetails && (
                <div className="p-3 bg-background/50 rounded-lg border">
                  <h4 className="font-medium mb-2">Résumé de votre commande</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Montant total : {((orderDetails.amount_total || 0) / 100).toFixed(2)}€</p>
                    <p>Status : {orderDetails.payment_status === 'paid' ? 'Payé' : 'En attente'}</p>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                <p>Pour toute question ou problème, veuillez me contacter :</p>
                <Link 
                  href="/#contact" 
                  className="text-primary hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Contacter le support
                </Link>
              </div>

              <div className="flex gap-3">
                <EnhancedSpotlightButton
                  onClick={onClose}
                  className="flex-1"
                >
                  Continuer mes achats
                </EnhancedSpotlightButton>
                <EnhancedSpotlightButton
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Retour à l'accueil
                </EnhancedSpotlightButton>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}