"use client"

import React from "react"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface PaymentCancelledShopProps {
  onClose: () => void
  onRetry: () => void
}

export function PaymentCancelledShop({ onClose, onRetry }: PaymentCancelledShopProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-400">
            <XCircle className="h-6 w-6" />
            Paiement Annulé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Votre paiement a été annulé. Votre panier a été conservé.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="text-orange-600 text-sm">
              Aucun montant n'a été débité de votre compte. Vous pouvez réessayer quand vous le souhaitez.
            </p>
          </div>

          <div className="flex gap-3">
            <EnhancedSpotlightButton
              onClick={onRetry}
              className="flex-1"
            >
              Réessayer le paiement
            </EnhancedSpotlightButton>
            <EnhancedSpotlightButton
              onClick={onClose}
              className="flex-1"
            >
              Continuer mes achats
            </EnhancedSpotlightButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}