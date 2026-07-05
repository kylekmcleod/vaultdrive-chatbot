import { useState } from 'react'
import { useChat } from '../../../hooks/useChat'
import WidgetHeader from '../ui/WidgetHeader'
import WidgetInput from '../ui/WidgetInput'
import PoweredByFooter from '../ui/PoweredByFooter'
import MessageList from './MessageList'
import './ChatScreen.css'

function ChatScreen({ onClose, onEndConversation, isClosing, initialMessage }) {
  const { messages, sendMessage, isLoading, error, endConversation } = useChat(initialMessage)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!inputValue.trim()) return
    sendMessage(inputValue)
    setInputValue('')
  }

  const handleEndConversation = () => {
    endConversation()
    onEndConversation()
  }

  return (
    <section
      className={`chat-screen ${isClosing ? 'chat-screen--closing' : 'chat-screen--open'}`}
      aria-label="Chat with Jessica"
    >
      <WidgetHeader onClose={onClose} onEndConversation={handleEndConversation} />

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
        <PoweredByFooter />
      </div>
    </section>
  )
}

export default ChatScreen
