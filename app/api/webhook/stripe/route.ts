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
      // Determine the type of order based on metadata
      const orderType = session.metadata?.orderType || 'unknown'

      if (orderType === 'print_shop') {
        // Handle print shop orders
        const cartData = session.metadata?.cartData ? JSON.parse(session.metadata.cartData) : []
        const shippingAddress = session.metadata?.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : {}
        
        // Prepare order data for FormCarry
        const orderData = {
          orderType: 'print_shop',
          orderId: session.id,
          paymentStatus: 'completed',
          amount: session.amount_total ? (session.amount_total / 100) : 0,
          currency: session.currency,
          
          // Customer information
          customerFirstName: session.metadata?.customerFirstName,
          customerLastName: session.metadata?.customerLastName,
          customerEmail: session.metadata?.customerEmail,
          customerPhone: session.metadata?.customerPhone,
          
          // Shipping information
          shippingAddress: shippingAddress,
          deliveryOption: session.metadata?.deliveryOption,
          
          // Order items
          items: cartData.map((item: any) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            license: item.license
          })),
          
          timestamp: new Date().toISOString(),
        }

        // Send data to FormCarry
        const formCarryResponse = await fetch('https://formcarry.com/s/JuLfbQPieYN', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        if (!formCarryResponse.ok) {
          console.error('Failed to send shop order data to FormCarry:', await formCarryResponse.text())
        } else {
          console.log('Successfully sent shop order data to FormCarry for session:', session.id)
        }

      } else {
        // Handle other order types (like subscriptions) - original code
        const formCarryResponse = await fetch('https://formcarry.com/s/JuLfbQPieYN', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            orderType: 'subscription',
            firstName: session.metadata?.firstName,
            lastName: session.metadata?.lastName,
            email: session.metadata?.email,
            discordUsername: session.metadata?.discordUsername,
            orderId: session.id,
            paymentStatus: 'completed',
            subscriptionType: 'cours_collectifs',
            amount: session.amount_total ? (session.amount_total / 100) : 48,
            currency: session.currency,
            timestamp: new Date().toISOString(),
          }),
        })

        if (!formCarryResponse.ok) {
          console.error('Failed to send subscription data to FormCarry:', await formCarryResponse.text())
        } else {
          console.log('Successfully sent subscription data to FormCarry for session:', session.id)
        }
      }

    } catch (error) {
      console.error('Error processing successful payment:', error)
    }
  }

  return NextResponse.json({ received: true })
}