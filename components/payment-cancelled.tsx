"use client"

import React from "react"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface PaymentCancelledProps {
  onClose: () => void
  onRetry: () => void
}

export function PaymentCancelled({ onClose, onRetry }: PaymentCancelledProps) {
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
              Votre paiement a été annulé ou refusé. Aucun montant n'a été débité.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-red-600 text-sm">
              Si vous rencontrez des difficultés avec le paiement, n'hésitez pas à me contacter directement.
            </p>
          </div>

          <div className="flex gap-3">
            <EnhancedSpotlightButton
              onClick={onRetry}
              className="flex-1"
            >
              Réessayer
            </EnhancedSpotlightButton>
            <EnhancedSpotlightButton
              onClick={onClose}
              className="flex-1"
            >
              Fermer
            </EnhancedSpotlightButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}