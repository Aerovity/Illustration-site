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
          firstName: session.metadata?.shippingFirstName,
          lastName: session.metadata?.shippingLastName,
          address: session.metadata?.shippingAddress,
          city: session.metadata?.shippingCity,
          postalCode: session.metadata?.shippingPostalCode,
          country: session.metadata?.shippingCountry
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

        // Send email notifications via FormCarry
        try {
          const customerName = `${session.metadata?.customerFirstName} ${session.metadata?.customerLastName}`
          const itemsList = items.map((item: any) => 
            `• ${item.name} (Taille ${item.size}) x${item.quantity} - ${item.price}€`
          ).join('\n')

          const orderMessage = `
🎉 NOUVELLE COMMANDE REÇUE !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 DÉTAILS DE LA COMMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 ID de commande : ${session.id}
👤 Client : ${customerName}
📧 Email : ${session.metadata?.customerEmail}
📱 Téléphone : ${session.metadata?.customerPhone || 'Non renseigné'}
💰 Montant total : ${((session.amount_total || 0) / 100).toFixed(2)}€

📋 Articles commandés :
${itemsList}

🚚 Livraison : ${session.metadata?.deliveryOption}
📍 Adresse de livraison :
${shippingAddress.firstName} ${shippingAddress.lastName}
${shippingAddress.address}
${shippingAddress.postalCode} ${shippingAddress.city}
${shippingAddress.country}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action requise : Préparer et expédier la commande.
          `.trim()

          // Send via FormCarry using form data
          const formData = new FormData()
          formData.append('name', customerName)
          formData.append('email', session.metadata?.customerEmail || '')
          formData.append('message', orderMessage)

          const emailResponse = await fetch('https://formcarry.com/s/JuLfbQPieYN', {
            method: 'POST',
            body: formData
          })

          if (!emailResponse.ok) {
            console.error('Failed to send order notification via FormCarry:', await emailResponse.text())
          } else {
            console.log('Successfully sent order notification via FormCarry for session:', session.id)
          }
        } catch (emailError) {
          console.error('Error sending order notification:', emailError)
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