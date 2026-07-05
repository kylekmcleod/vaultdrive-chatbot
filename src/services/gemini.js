import { GEMINI_MODEL } from '../constants/config'
import { SYSTEM_PROMPT } from '../constants/prompts'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

function getApiKey() {
  const apiKey = import.meta.env.VITE_GENAI_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_GENAI_API_KEY. Add it to your .env file.')
  }

  return apiKey
}

function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user'
}

export async function sendChatMessage(messages) {
  const apiKey = getApiKey()

  const response = await fetch(
    `${API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: messages.map((message) => ({
          role: toGeminiRole(message.role),
          parts: [{ text: message.content }],
        })),
      }),
    },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini API error (${response.status})`)
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

  return text.trim()
}
