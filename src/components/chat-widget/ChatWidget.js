import { useState, useRef } from 'react'
import { WIDGET_VIEWS } from './constants/config'
import { hasSavedChat, clearSavedMessages } from './hooks/useChat'
import FloatingButton from './launcher/FloatingButton'
import LandingScreen from './landing/LandingScreen'
import ChatScreen from './chat/ChatScreen'
import VoiceScreen from './voice/VoiceScreen'
import './ChatWidget.css'

const CLOSE_ANIMATION_MS = 280

function ChatWidget() {
  const [view, setView] = useState(() => {
    return hasSavedChat() ? WIDGET_VIEWS.CHAT : WIDGET_VIEWS.CLOSED
  })
  const [isClosing, setIsClosing] = useState(false)
  const initialMessageRef = useRef(null)

  const isOpen = view !== WIDGET_VIEWS.CLOSED

  const openWidget = () => {
    setIsClosing(false)
    if (hasSavedChat()) {
      initialMessageRef.current = null
      setView(WIDGET_VIEWS.CHAT)
    } else {
      setView(WIDGET_VIEWS.LANDING)
    }
  }

  const goToChat = (message) => {
    initialMessageRef.current = message || null
    setView(WIDGET_VIEWS.CHAT)
  }

  const goToVoice = () => {
    setView(WIDGET_VIEWS.VOICE)
  }

  const closeWidget = () => {
    setIsClosing(true)
    window.setTimeout(() => {
      setView(WIDGET_VIEWS.CLOSED)
      setIsClosing(false)
    }, CLOSE_ANIMATION_MS)
  }

  const handleEndConversation = () => {
    setIsClosing(true)
    window.setTimeout(() => {
      initialMessageRef.current = null
      clearSavedMessages()
      setView(WIDGET_VIEWS.CLOSED)
      setIsClosing(false)
    }, CLOSE_ANIMATION_MS)
  }

  return (
    <div className="chat-widget">
      {!isOpen && (
        <FloatingButton onClick={openWidget} />
      )}

      {view === WIDGET_VIEWS.LANDING && (
        <LandingScreen
          onClose={closeWidget}
          onStartChat={goToChat}
          onStartVoice={goToVoice}
          isClosing={isClosing}
        />
      )}

      {view === WIDGET_VIEWS.CHAT && (
        <ChatScreen
          onClose={closeWidget}
          onEndConversation={handleEndConversation}
          onStartVoice={goToVoice}
          isClosing={isClosing}
          initialMessage={initialMessageRef.current}
        />
      )}

      {view === WIDGET_VIEWS.VOICE && (
        <VoiceScreen
          onClose={closeWidget}
          onSwitchToText={() => goToChat()}
          isClosing={isClosing}
        />
      )}
    </div>
  )
}

export default ChatWidget
