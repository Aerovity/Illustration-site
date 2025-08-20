import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { 
      cart, 
      address, 
      deliveryOption, 
      deliveryPrice, 
      totalAmount, 
      successUrl, 
      cancelUrl 
    } = await request.json()

    // Create line items for each cart item
    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} (Taille ${item.size})`,
          description: item.license ? `Licence: ${item.license}` : undefined,
          images: [item.image],
          metadata: {
            item_id: item.id,
            size: item.size,
            license: item.license || '',
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add delivery as a separate line item
    if (deliveryPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Livraison - ${deliveryOption}`,
            description: `Frais de livraison pour ${deliveryOption}`,
          },
          unit_amount: Math.round(deliveryPrice * 100),
        },
        quantity: 1,
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: address.email,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'DE', 'ES', 'IT', 'NL', 'PT', 'CH', 'GB', 'US', 'CA'],
      },
      billing_address_collection: 'required',
      metadata: {
        orderType: 'print_shop',
        customerFirstName: address.firstName,
        customerLastName: address.lastName,
        customerEmail: address.email,
        customerPhone: address.phone || '',
        shippingAddress: JSON.stringify(address),
        deliveryOption: deliveryOption,
        cartData: JSON.stringify(cart),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating shop checkout session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}