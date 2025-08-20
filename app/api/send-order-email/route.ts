import { NextRequest, NextResponse } from 'next/server'
import { sendOrderNotificationEmails, OrderData } from '@/lib/email-notifications'

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    // Validate required fields
    if (!orderData.orderId || !orderData.customerEmail || !orderData.customerName) {
      return NextResponse.json(
        { error: 'Missing required order data' },
        { status: 400 }
      )
    }

    const results = await sendOrderNotificationEmails(orderData)

    return NextResponse.json({
      success: results.adminEmailSent && results.customerEmailSent,
      adminEmailSent: results.adminEmailSent,
      customerEmailSent: results.customerEmailSent,
      errors: results.errors
    })

  } catch (error) {
    console.error('Error in send-order-email API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send order emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}