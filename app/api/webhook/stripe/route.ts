import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Send data to FormCarry
      const formCarryResponse = await fetch('https://formcarry.com/s/JuLfbQPieYN', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: session.metadata?.firstName,
          lastName: session.metadata?.lastName,
          email: session.metadata?.email,
          discordUsername: session.metadata?.discordUsername,
          orderId: session.id,
          paymentStatus: 'completed',
          subscriptionType: 'cours_collectifs',
          amount: session.amount_total ? (session.amount_total / 100) : 48, // Convert from cents
          currency: session.currency,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!formCarryResponse.ok) {
        console.error('Failed to send data to FormCarry:', await formCarryResponse.text())
      } else {
        console.log('Successfully sent data to FormCarry for session:', session.id)
      }

    } catch (error) {
      console.error('Error processing successful payment:', error)
    }
  }

  return NextResponse.json({ received: true })
}