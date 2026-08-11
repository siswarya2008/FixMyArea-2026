const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  })
}

function getResponseText(response: any): string | null {
  if (!response) return null
  if (typeof response.output_text === 'string') return response.output_text

  const output = response.output
  if (!Array.isArray(output)) return null

  for (const item of output) {
    if (Array.isArray(item.content)) {
      for (const content of item.content) {
        if (content?.type === 'text' && typeof content?.text === 'string') {
          return content.text
        }
      }
    }
  }

  return null
}

function parseJsonString(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    const match = value.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

function normalizeAnalysis(payload: any) {
  if (!payload || typeof payload !== 'object') return null

  const category = payload.category?.toString().trim()
  const severity = payload.severity?.toString().trim()
  const confidenceRaw = payload.confidence
  const description = payload.description?.toString().trim()
  const reasoning = payload.reasoning?.toString().trim()

  const allowedCategories = [
    'pothole',
    'garbage',
    'streetlight',
    'water_leak',
    'road_damage',
    'manhole',
    'other',
  ]

  const allowedSeverities = ['low', 'medium', 'high', 'critical']

  const confidence = typeof confidenceRaw === 'number'
    ? confidenceRaw
    : typeof confidenceRaw === 'string'
      ? Number(confidenceRaw.replace('%', '').trim())
      : NaN

  if (!category || !allowedCategories.includes(category)) return null
  if (!severity || !allowedSeverities.includes(severity)) return null
  if (Number.isNaN(confidence) || confidence < 0 || confidence > 100) return null
  if (!description || !reasoning) return null

  return {
    category,
    severity,
    confidence: Math.round(confidence),
    description,
    reasoning,
  }
}

export default {
  fetch: async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: CORS_HEADERS,
      })
    }

    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    if (!OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY in environment')
      return jsonResponse({ error: 'AI service unavailable' }, 500)
    }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const image = body?.image
  if (!image || typeof image !== 'string') {
    return jsonResponse({ error: 'Missing image data' }, 400)
  }

  const prompt = `You are a civic issue image analysis assistant. Analyze the attached image and return only valid JSON with these keys: category, severity, confidence, description, reasoning. Category must be one of pothole, garbage, streetlight, water_leak, road_damage, manhole, other. Severity must be one of low, medium, high, critical. Confidence must be a number between 0 and 100. Description should be short, clear, and suitable for a civic issue report. Reasoning should briefly explain why you selected the category and severity. Do not return any other keys or additional text.`

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

  async function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer)
    const chunkSize = 0x8000
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    return btoa(binary)
  }

  async function fetchImageAndBase64(url: string) {
    if (!url) return null
    // If it's already a data URL, parse it
    if (url.startsWith('data:')) {
      const match = url.match(/^data:(.+);base64,(.*)$/)
      if (!match) return null
      return { mime: match[1], base64: match[2] }
    }

    const imgResp = await fetch(url)
    if (!imgResp.ok) throw new Error('Failed to fetch image')
    const mime = imgResp.headers.get('content-type') || 'application/octet-stream'
    const buffer = await imgResp.arrayBuffer()
    const base64 = await arrayBufferToBase64(buffer)
    return { mime, base64 }
  }

  let text: string | null = null
  // Use Gemini API
  if (!GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY in environment')
    return jsonResponse({ error: 'AI service unavailable' }, 500)
  }

  try {
    const img = await fetchImageAndBase64(image)
    if (!img) {
      console.error('Failed to load image for AI analysis')
      return jsonResponse({ error: 'Invalid image data' }, 400)
    }

    const geminiBody = {
      model: 'gemini-2.5-flash-lite',
      // send prompt and inline image data
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', inline_data: { mime_type: img.mime, data: img.base64 } },
          ],
        },
      ],
    }

    const resp = await fetch('https://generativeapi.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify(geminiBody),
    })

    if (!resp.ok) {
      const bodyText = await resp.text()
      console.error('Gemini error', resp.status, bodyText)
      return jsonResponse({ error: 'AI analysis failed' }, 502)
    }

    const geminiResponse = await resp.json()
    // Extract generated text from candidates[0].content.parts
    const candidate = geminiResponse?.candidates?.[0]
    const parts = candidate?.content?.parts
    if (Array.isArray(parts)) {
      text = parts.map((p: any) => (typeof p === 'string' ? p : p?.text || '')).join('')
    } else if (typeof candidate?.content === 'string') {
      text = candidate.content
    }

  } catch (err) {
    console.error('Gemini request failed:', err)
    return jsonResponse({ error: 'AI analysis failed' }, 502)
  }
  if (!text) {
    return jsonResponse({ error: 'AI analysis returned no text output' }, 502)
  }

  const parsed = parseJsonString(text)
  const normalized = normalizeAnalysis(parsed)
  if (!normalized) {
    console.error('Failed to normalize AI response', parsed)
    return jsonResponse({ error: 'AI response could not be parsed' }, 502)
  }

  return jsonResponse(normalized)
} 
}
