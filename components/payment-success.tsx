"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface PaymentSuccessProps {
  sessionId: string
  onClose: () => void
}

export function PaymentSuccess({ sessionId, onClose }: PaymentSuccessProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/get-session-details?session_id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchOrderDetails()
    }
  }, [sessionId])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-400">
            <CheckCircle className="h-6 w-6" />
            Merci Pour Votre Paiement !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Récupération des détails...</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  Voici votre Order ID:
                </div>
                <div className="text-primary font-mono text-sm bg-primary/10 p-2 rounded">
                  {sessionId}
                </div>
              </div>
              
              <div className="text-center space-y-2">
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

              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">📅 Rappel des horaires :</p>
                <p className="text-sm text-muted-foreground">
                  Lundi et jeudi de 18h à 20h sur Discord
                </p>
              </div>
            </>
          )}

          <EnhancedSpotlightButton
            onClick={onClose}
            className="w-full mt-4"
          >
            Retour aux Services
          </EnhancedSpotlightButton>
        </CardContent>
      </Card>
    </div>
  )
}