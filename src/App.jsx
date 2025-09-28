import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './Components/ChatbotIcon'
import ChatForm from './Components/ChatForm'
import ChatMessage from './Components/ChatMessage'

export default function App() {
  const [chatHistory, setChatHistory] = useState([])
  const chatBodyRef = useRef()  // ✅ declare ref here

  const generateBotResponse = async (history) => {
    // 1. Add "Thinking..." placeholder
    setChatHistory(prev => [...prev, { role: "model", text: "Thinking..." }])

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }))

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory })
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong!")

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\**/g, "$1")
        .trim()

      // 2. Replace last "Thinking..." with real response
      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: apiResponseText || "Sorry, I didn’t understand that." }
        return updated
      })
    } catch (error) {
      console.error(error)
      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", text: "⚠️ Error fetching response" }
        return updated
      })
    }
  }

  // Auto-scroll when chat updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [chatHistory])

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message-bot">
            <ChatbotIcon />
            <p className="message-text">
              hey there 🙂 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  )
}
