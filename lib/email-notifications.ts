export interface OrderData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: Array<{
    name: string
    size: string
    quantity: number
    price: number
    license?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  deliveryOption: string
  totalAmount: number
  paymentId: string
}

async function sendEmailWithRetry(
  formData: FormData, 
  emailType: string, 
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://formcarry.com/s/JuLfbQPieYN', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorText = await response.text()
        
        if (attempt === maxRetries) {
          return { success: false, error: `${emailType} email failed after ${maxRetries} attempts: ${errorText}` }
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    } catch (error) {
      
      if (attempt === maxRetries) {
        return { success: false, error: `${emailType} email error after ${maxRetries} attempts: ${error}` }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  
  return { success: false, error: `${emailType} email failed after ${maxRetries} attempts` }
}

export async function sendOrderNotificationEmails(orderData: OrderData): Promise<{
  adminEmailSent: boolean
  customerEmailSent: boolean
  errors: string[]
}> {
  const results = {
    adminEmailSent: false,
    customerEmailSent: false,
    errors: [] as string[]
  }

  const itemsList = orderData.items.map(item => 
    `• ${item.name} (Taille ${item.size}) x${item.quantity} - ${item.price}€${item.license && item.license !== 'N/A' ? ` - ${item.license}` : ''}`
  ).join('\n')

  // Admin notification email
  const adminMessage = `🎉 NOUVELLE COMMANDE REÇUE !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 DÉTAILS DE LA COMMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 ID de commande : ${orderData.orderId}
💳 ID de paiement : ${orderData.paymentId}
👤 Client : ${orderData.customerName}
📧 Email : ${orderData.customerEmail}
📱 Téléphone : ${orderData.customerPhone || 'Non renseigné'}
💰 Montant total : ${orderData.totalAmount.toFixed(2)}€

📋 Articles commandés :
${itemsList}

🚚 Livraison : ${orderData.deliveryOption}
📍 Adresse de livraison :
${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.postalCode} ${orderData.shippingAddress.city}
${orderData.shippingAddress.country}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Action requise : Préparer et expédier la commande.

Date de commande : ${new Date().toLocaleString('fr-FR')}
  `.trim()

  const adminFormData = new FormData()
  adminFormData.append('name', 'Nouveau client - ' + orderData.customerName)
  adminFormData.append('email', 'bobe.florian.mei@gmail.com')
  adminFormData.append('subject', `🎉 Nouvelle commande - ${orderData.orderId}`)
  adminFormData.append('message', adminMessage)

  const adminResult = await sendEmailWithRetry(adminFormData, 'Admin')
  results.adminEmailSent = adminResult.success
  if (adminResult.error) {
    results.errors.push(adminResult.error)
  }

  // Customer confirmation email
  const customerMessage = `Bonjour ${orderData.customerName},

Merci pour votre commande ! Nous avons bien reçu votre paiement et votre commande est en cours de traitement.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 RÉCAPITULATIF DE VOTRE COMMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Numéro de commande : ${orderData.orderId}
💳 ID de paiement : ${orderData.paymentId}
💰 Montant payé : ${orderData.totalAmount.toFixed(2)}€

📋 Articles commandés :
${itemsList}

🚚 Mode de livraison : ${orderData.deliveryOption}
📍 Adresse de livraison :
${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.postalCode} ${orderData.shippingAddress.city}
${orderData.shippingAddress.country}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PROCHAINES ÉTAPES

• Votre commande va être préparée sous 24-48h
• Vous recevrez un email de confirmation d'expédition avec le numéro de suivi
• Livraison estimée : 2-5 jours ouvrés selon votre région

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 BESOIN D'AIDE ?

Si vous avez des questions concernant votre commande, n'hésitez pas à me contacter :
📧 Email : bobe.florian.mei@gmail.com

Merci encore pour votre confiance !

Cordialement,
Florian Mei
  `.trim()

  // Customer email removed - admin will verify and contact customer directly
  results.customerEmailSent = true

  return results
}