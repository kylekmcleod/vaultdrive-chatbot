import { useCallback, useEffect, useRef, useState } from 'react'
import { DEALERSHIP } from '../constants/config'
import { sendChatMessage } from '../services/gemini'

const STORAGE_KEY = 'vaultdrive_chat_messages'

const INTRO_MESSAGE = {
  id: 'jessica-intro',
  role: 'assistant',
  content: `Hi there! I'm ${DEALERSHIP.agentName}, your virtual assistant at ${DEALERSHIP.name}. How can I help you today?`,
}

function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  }
}

function loadSavedMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return null
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch { /* ignore */ }
}

export function clearSavedMessages() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function hasSavedChat() {
  const saved = loadSavedMessages()
  return saved !== null && saved.length > 1
}

export function useChat(initialMessage) {
  const [messages, setMessages] = useState(() => {
    const saved = loadSavedMessages()
    if (saved) return saved
    if (initialMessage) return [createMessage('user', initialMessage.trim())]
    return [INTRO_MESSAGE]
  })

  const [isLoading, setIsLoading] = useState(() => {
    const saved = loadSavedMessages()
    return !saved && !!initialMessage
  })

  const [error, setError] = useState(null)
  const hasFired = useRef(false)

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages)
    }
  }, [messages])

  useEffect(() => {
    if (hasFired.current) return
    const saved = loadSavedMessages()
    if (saved && saved.length > 1) return
    if (!initialMessage) return

    hasFired.current = true

    const userMsg = messages[0]
    sendChatMessage([userMsg])
      .then((reply) => {
        setMessages((prev) => [...prev, createMessage('assistant', reply)])
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const sendMessage = useCallback(async (content) => {
    const trimmed = content.trim()
    if (!trimmed || isLoading) return

    const userMessage = createMessage('user', trimmed)
    const history = [...messages, userMessage]

    setMessages(history)
    setIsLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(history)
      setMessages((prev) => [...prev, createMessage('assistant', reply)])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  const endConversation = useCallback(() => {
    clearSavedMessages()
    setMessages([INTRO_MESSAGE])
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearError,
    endConversation,
  }
}
