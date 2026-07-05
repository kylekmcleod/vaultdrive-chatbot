import AugustLogo from './AugustLogo'
import CloseIcon from './icons/CloseIcon'
import './AugustLogo.css'
import './WidgetHeader.css'

function WidgetHeader({ onClose, onEndConversation }) {
  return (
    <header className="widget-header">
      <div className="widget-header__brand">
        <AugustLogo />
      </div>
      <div className="widget-header__actions">
        {onEndConversation && (
          <button
            type="button"
            className="widget-header__end-btn"
            onClick={onEndConversation}
          >
            End Conversation
          </button>
        )}
        <button
          type="button"
          className="widget-header__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </div>
    </header>
  )
}

export default WidgetHeader
