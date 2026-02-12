import logger from '@/utils/logger'

export type AdminCategoryOption =
  | 'personalizado'
  | 'negocios'
  | 'hogar'
  | 'eventos'
  | 'decorativo'

export interface ProductAutofillResult {
  title: string
  description: string
  category: AdminCategoryOption
  priceArs: number | null
}

const DEFAULT_MODEL = 'gemini-2.5-flash'
const VALID_CATEGORIES = new Set<AdminCategoryOption>([
  'personalizado',
  'negocios',
  'hogar',
  'eventos',
  'decorativo'
])

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const raw = reader.result
      if (typeof raw !== 'string') {
        reject(new Error('No se pudo leer la imagen'))
        return
      }
      const base64 = raw.split(',')[1]
      if (!base64) {
        reject(new Error('No se pudo convertir la imagen a base64'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Error al leer la imagen'))
    reader.readAsDataURL(file)
  })
}

function normalizeCategory(input: unknown): AdminCategoryOption {
  const value = String(input ?? '')
    .trim()
    .toLowerCase()

  if (VALID_CATEGORIES.has(value as AdminCategoryOption)) {
    return value as AdminCategoryOption
  }

  const aliases: Record<string, AdminCategoryOption> = {
    custom: 'personalizado',
    personalizado: 'personalizado',
    personalizadas: 'personalizado',
    business: 'negocios',
    negocios: 'negocios',
    home: 'hogar',
    hogar: 'hogar',
    events: 'eventos',
    event: 'eventos',
    eventos: 'eventos',
    decorative: 'decorativo',
    decorativo: 'decorativo'
  }

  return aliases[value] ?? 'personalizado'
}

function extractJsonText(rawText: string): string {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()

  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    return cleaned
  }

  return cleaned.slice(start, end + 1)
}

function sanitizeResult(payload: any): ProductAutofillResult {
  const title = String(payload?.title ?? '').trim()
  const description = String(payload?.description ?? '').trim()
  const category = normalizeCategory(payload?.category)

  const rawPrice = payload?.priceArs
  const parsedPrice = Number(rawPrice)
  const priceArs = Number.isFinite(parsedPrice) && parsedPrice > 0
    ? Math.round(parsedPrice)
    : null

  if (!title || !description) {
    throw new Error('La IA no devolvio un titulo y descripcion validos')
  }

  return {
    title,
    description,
    category,
    priceArs
  }
}

export async function generateProductAutofillFromImage(file: File): Promise<ProductAutofillResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('Falta VITE_GEMINI_API_KEY en el archivo de entorno')
  }

  const model = (import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL).trim()
  const base64Image = await fileToBase64(file)

  const prompt = [
    'Analiza la imagen de un cartel de neon y devuelve SOLO JSON valido sin markdown.',
    'Usa exactamente este schema:',
    '{',
    '  "title": "string corto en espanol (max 60)",',
    '  "description": "string claro para catalogo (max 160)",',
    '  "category": "personalizado|negocios|hogar|eventos|decorativo",',
    '  "priceArs": number | null',
    '}',
    'Reglas:',
    '- No inventes datos absurdos.',
    '- Si no se puede inferir precio, usa null.',
    '- Mantener estilo comercial profesional en espanol.'
  ].join('\n')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.type || 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          responseMimeType: 'application/json'
        }
      })
    }
  )

  const payload = await response.json()

  if (!response.ok) {
    const apiMessage = payload?.error?.message || 'Error desconocido de Gemini'
    throw new Error(apiMessage)
  }

  const rawText = payload?.candidates?.[0]?.content?.parts
    ?.map((part: any) => part?.text || '')
    .join('\n')
    .trim()

  if (!rawText) {
    logger.error('[AI Autofill] Respuesta vacia de Gemini', payload)
    throw new Error('Gemini no devolvio contenido util')
  }

  let parsed: any
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch (error) {
    logger.error('[AI Autofill] Error parseando JSON', { rawText, error })
    throw new Error('No se pudo interpretar la respuesta de Gemini')
  }

  return sanitizeResult(parsed)
}

export default {
  generateProductAutofillFromImage
}
