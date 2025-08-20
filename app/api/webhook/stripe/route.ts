import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderNotificationEmails, OrderData } from '@/lib/email-notifications'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
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
        // Parse cart items from metadata
        const cartItemsString = session.metadata?.cartItems || ''
        const items = cartItemsString.split(';')
          .filter(item => item.trim())
          .map(item => {
            const [name, size, quantity, price, license] = item.split('|')
            return {
              name: name || 'Unknown Item',
              size: size || 'Unknown',
              quantity: parseInt(quantity) || 1,
              price: parseFloat(price) || 0,
              license: license === 'N/A' ? '' : license || ''
            }
          })

        // Build shipping address from metadata
        const shippingAddress = {
          firstName: session.metadata?.shippingFirstName || '',
          lastName: session.metadata?.shippingLastName || '',
          address: session.metadata?.shippingAddress || '',
          city: session.metadata?.shippingCity || '',
          postalCode: session.metadata?.shippingPostalCode || '',
          country: session.metadata?.shippingCountry || ''
        }
        
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
          items: items,
          
          timestamp: new Date().toISOString(),
        }

        // Send email notifications using the new notification system
        try {
          const orderNotificationData: OrderData = {
            orderId: session.id,
            customerName: `${session.metadata?.customerFirstName} ${session.metadata?.customerLastName}`,
            customerEmail: session.metadata?.customerEmail || '',
            customerPhone: session.metadata?.customerPhone,
            items: items,
            shippingAddress: shippingAddress,
            deliveryOption: session.metadata?.deliveryOption || '',
            totalAmount: (session.amount_total || 0) / 100,
            paymentId: session.payment_intent as string || session.id
          }

          const emailResults = await sendOrderNotificationEmails(orderNotificationData)
          
          if (emailResults.adminEmailSent && emailResults.customerEmailSent) {
            console.log('✅ All order notification emails sent successfully for session:', session.id)
          } else {
            console.log('⚠️ Some notification emails failed for session:', session.id)
            if (!emailResults.adminEmailSent) console.log('❌ Admin email failed')
            if (!emailResults.customerEmailSent) console.log('❌ Customer email failed')
            emailResults.errors.forEach(error => console.error('Email error:', error))
          }

        } catch (emailError) {
          console.error('Error sending order notifications:', emailError)
        }

        // Also send data to FormCarry for record keeping
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