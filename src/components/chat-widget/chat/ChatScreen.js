import { useState } from 'react'
import { useChat } from '../hooks/useChat'
import WidgetHeader from '../ui/WidgetHeader'
import WidgetInput from '../ui/WidgetInput'
import PoweredByFooter from '../ui/PoweredByFooter'
import MessageList from './MessageList'
import './ChatScreen.css'

function ChatScreen({ onClose, onEndConversation, onStartVoice, isClosing, initialMessage }) {
  const { messages, sendMessage, isLoading, error, endConversation } = useChat(initialMessage)
  const [inputValue, setInputValue] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!inputValue.trim()) return
    sendMessage(inputValue)
    setInputValue('')
  }

  const handleEndClick = () => setShowConfirm(true)
  const handleCancel = () => setShowConfirm(false)

  const handleConfirmEnd = () => {
    endConversation()
    onEndConversation()
  }

  if (showConfirm) {
    return (
      <section
        className={`chat-screen ${isClosing ? 'chat-screen--closing' : 'chat-screen--open'}`}
        aria-label="End conversation confirmation"
      >
        <div className="chat-screen__confirm">
          <h3 className="chat-screen__confirm-title">End Conversation?</h3>
          <p className="chat-screen__confirm-text">
            This will clear your chat history. Are you sure?
          </p>
          <div className="chat-screen__confirm-actions">
            <button
              type="button"
              className="chat-screen__confirm-btn chat-screen__confirm-btn--yes"
              onClick={handleConfirmEnd}
            >
              Yes, end it
            </button>
            <button
              type="button"
              className="chat-screen__confirm-btn chat-screen__confirm-btn--no"
              onClick={handleCancel}
            >
              No, go back
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`chat-screen ${isClosing ? 'chat-screen--closing' : 'chat-screen--open'}`}
      aria-label="Chat with Jessica"
    >
      <WidgetHeader onClose={onClose} onEndConversation={handleEndClick} />

      <MessageList messages={messages} isLoading={isLoading} />

      {error && (
        <div className="chat-screen__error">{error}</div>
      )}

      <div className="chat-screen__footer">
        <WidgetInput
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
        <p className="chat-screen__voice-toggle">
          Prefer to talk?{' '}
          <button type="button" className="chat-screen__voice-link" onClick={onStartVoice}>
            Start a voice call
          </button>
        </p>
        <PoweredByFooter />
      </div>
    </section>
  )
}

export default ChatScreen
