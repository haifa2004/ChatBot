import React from 'react'
import ChatbotIcon from './ChatbotIcon'

export default function ChatMessage({ chat }) {
  return (
    <div className={`message-${chat.role === "model" ? "bot" : "user"}`}>
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message-text">
        {chat.text}
      </p>
    </div>
  )
}
