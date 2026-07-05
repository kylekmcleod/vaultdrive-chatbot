import { useCallback, useState } from 'react'
import { DEALERSHIP } from '../constants/config'
import { sendChatMessage } from '../services/gemini'

const INTRO_MESSAGE = {
  id: 'jessica-intro',
  role: 'assistant',
  content: `Hi there! I'm ${DEALERSHIP.agentName}, your virtual assistant at ${DEALERSHIP.name}. What's your name?`,
}

function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  }
}

export function useChat() {
  const [messages, setMessages] = useState([INTRO_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const clearError = useCallback(() => setError(null), [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearError,
  }
}
