const WHATSAPP_E164 = '+5491140916764'
const WHATSAPP_NUMBER = '5491140916764'

export { WHATSAPP_E164 }

export function getWhatsAppNumber(): string {
  return WHATSAPP_NUMBER
}

export function buildWhatsAppUrl(message: string): string {
  const finalMessage = message?.trim() ?? ''
  const encoded = encodeURIComponent(finalMessage)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}
